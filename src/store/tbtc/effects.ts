import { BitcoinAddressConverter } from "@keep-network/tbtc-v2.ts"
import { TaskAbortError } from "@reduxjs/toolkit"
import {
  getChainIdentifier,
  getContractPastEvents,
  isPublicKeyHashTypeAddress,
  reverseTxHash,
} from "../../threshold-ts/utils"
import { MintingStep } from "../../types/tbtc"
import { ONE_SEC_IN_MILISECONDS } from "../../utils/date"
import {
  key,
  removeDataForAccount,
  TBTCLocalStorageDepositData,
} from "../../utils/tbtcLocalStorageData"
import {
  isAddress,
  isAddressZero,
  isEmptyOrZeroAddress,
} from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { tbtcSlice } from "./tbtcSlice"

export const fetchBridgeactivityEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.requestBridgeActivity>,
  listenerApi: AppListenerEffectAPI
) => {
  const { depositor } = action.payload
  if (!isAddress(depositor) || isAddressZero(depositor)) return

  listenerApi.unsubscribe()

  listenerApi.dispatch(tbtcSlice.actions.fetchingBridgeActivity())

  try {
    const data = await listenerApi.extra.threshold.tbtc.bridgeActivity(
      depositor
    )
    listenerApi.dispatch(tbtcSlice.actions.bridgeActivityFetched(data))
  } catch (error) {
    console.error("Could not fetch bridge activity: ", error)
    listenerApi.subscribe()
    listenerApi.dispatch(
      tbtcSlice.actions.bridgeActivityFailed({
        error: "Could not fetch bridge activity.",
      })
    )
  }
}

export const fetchDepositDetailsDataEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.requestDepositDetailsData>,
  listenerApi: AppListenerEffectAPI
) => {
  const { depositKey } = action.payload
  if (!depositKey) return

  listenerApi.dispatch(tbtcSlice.actions.fetchingDepositDetailsData())

  try {
    const { depositor } =
      (await listenerApi.extra.threshold.tbtc.bridgeContract.deposits(
        depositKey
      )) as {
        depositor: string
      }
    if (isEmptyOrZeroAddress(depositor)) {
      throw new Error("Deposit not found...")
    }

    const revealedDeposits =
      await listenerApi.extra.threshold.tbtc.findAllRevealedDeposits(depositor)

    const deposit = revealedDeposits.find(
      (deposit) => deposit.depositKey === depositKey
    )

    if (!deposit) {
      throw new Error(
        "Could not find `DepositRevealed` event by given deposit key."
      )
    }

    const optimisticMintingRequestedEvents = await getContractPastEvents(
      listenerApi.extra.threshold.tbtc.vaultContract,
      {
        eventName: "OptimisticMintingRequested",
        fromBlock: deposit.blockNumber,
        filterParams: [undefined, depositKey, depositor],
      }
    )

    const optimisticMintingFinalizedEvents = await getContractPastEvents(
      listenerApi.extra.threshold.tbtc.vaultContract,
      {
        eventName: "OptimisticMintingFinalized",
        fromBlock: deposit.blockNumber,
        filterParams: [undefined, depositKey, depositor],
      }
    )

    const btcTxHash = reverseTxHash(deposit.fundingTxHash).toString()
    const confirmations =
      await listenerApi.extra.threshold.tbtc.getTransactionConfirmations(
        btcTxHash
      )
    const requiredConfirmations =
      listenerApi.extra.threshold.tbtc.minimumNumberOfConfirmationsNeeded(
        deposit.amount
      )

    const { treasuryFee, optimisticMintFee, amountToMint } =
      await listenerApi.extra.threshold.tbtc.getEstimatedDepositFees(
        deposit.amount
      )

    const depositDetailsData = {
      btcTxHash,
      depositRevealedTxHash: deposit.txHash,
      amount: amountToMint,
      treasuryFee,
      optimisticMintFee,
      optimisticMintingRequestedTxHash:
        optimisticMintingRequestedEvents[0]?.transactionHash,
      optimisticMintingFinalizedTxHash:
        optimisticMintingFinalizedEvents[0]?.transactionHash,
      requiredConfirmations,
      confirmations,
    }

    const depositKeyFromStore =
      listenerApi.getState().tbtc.depositDetails.depositKey

    /**
     * If deposit key changed in the store while data was fetching then we don't
     * update the store with the fetched data. This is to prevent saving the
     * data in the store after we clear the data for given deposit key (for
     * example when we leave the deposit details page while data is fetching).
     */
    if (depositKey !== depositKeyFromStore) return
    listenerApi.dispatch(
      tbtcSlice.actions.depositDetailsDataFetched(depositDetailsData)
    )

    /**
     * If deposit doesn't have required number of confirmations then we start
     * listening for new confirmations.
     */
    if (btcTxHash && confirmations < requiredConfirmations) {
      listenerApi.dispatch(
        tbtcSlice.actions.fetchUtxoConfirmations({
          utxo: { transactionHash: btcTxHash, value: deposit.amount },
        })
      )
    }
  } catch (error) {
    console.error("Could not fetch deposit details: ", error)
    listenerApi.subscribe()
    listenerApi.dispatch(
      tbtcSlice.actions.depositDetailsDataFetchFailed({
        error: "Could not fetch deposit details.",
      })
    )
  }
}

export const findUtxoEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.findUtxo>,
  listenerApi: AppListenerEffectAPI
) => {
  const { btcDepositAddress, depositor } = action.payload

  const {
    tbtc: {
      ethAddress,
      blindingFactor,
      walletPublicKeyHash,
      refundLocktime,
      btcRecoveryAddress,
    },
  } = listenerApi.getState()

  if (
    !btcDepositAddress ||
    (!isAddress(depositor) && !isAddressZero(depositor))
  )
    return

  // Cancel any in-progress instances of this listener.
  listenerApi.cancelActiveListeners()

  const pollingTask = listenerApi.fork(async (forkApi) => {
    try {
      while (true) {
        // Initiating deposit from redux store (if deposit object is empty)
        if (!listenerApi.extra.threshold.tbtc.deposit) {
          const bitcoinNetwork = listenerApi.extra.threshold.tbtc.bitcoinNetwork

          if (!isPublicKeyHashTypeAddress(btcRecoveryAddress, bitcoinNetwork)) {
            throw new Error("Bitcoin recovery address must be P2PKH or P2WPKH")
          }

          const refundPublicKeyHash =
            BitcoinAddressConverter.addressToPublicKeyHash(
              btcRecoveryAddress,
              bitcoinNetwork
            ).toString()
          await forkApi.pause(
            listenerApi.extra.threshold.tbtc.initiateDepositFromDepositScriptParameters(
              {
                depositor: getChainIdentifier(ethAddress),
                blindingFactor,
                walletPublicKeyHash,
                refundPublicKeyHash,
                refundLocktime,
              }
            )
          )
        }

        // Looking for utxo.
        const utxos = await forkApi.pause(
          listenerApi.extra.threshold.tbtc.findAllUnspentTransactionOutputs()
        )

        if (!utxos || utxos.length === 0) {
          // Bitcoin deposit address exists and there is no utxo for a given
          // deposit address- this means someone wants to use this deposit
          // address to mint tBTC. Redirect to step 2 and continue searching for
          // utxo.
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.Deposit,
            })
          )
          await forkApi.delay(10 * ONE_SEC_IN_MILISECONDS)
          continue
        }

        let utxo = utxos[0]
        let areAllDepositRevealed = true

        // We have to find the first UTXO that is not revealed. The UTXOs
        // returned from `findAllUnspentTransactionOutputs` are in reversed
        // order so we have to start our search from the last element of the
        // `utxos` so that we search them in the order they were done. We go
        // through all of them up to the first one to find the oldest UTXO that
        // is not revealed.
        // If all deposits are revealed then we just use the first UTXO (which
        // should be the most recent transaction).
        for (let i = utxos.length - 1; i >= 0; i--) {
          // Check if deposit is revealed.
          const deposit = await forkApi.pause(
            listenerApi.extra.threshold.tbtc.getRevealedDeposit(utxos[i])
          )
          const isDepositRevealed = deposit.revealedAt !== 0

          if (!isDepositRevealed) {
            utxo = utxos[i]
            areAllDepositRevealed = false
            break
          }
        }

        if (areAllDepositRevealed) {
          // All deposits are already revealed. Force start from step 1 and
          // remove deposit data.
          removeDataForAccount(
            depositor,
            JSON.parse(
              localStorage.getItem(key) || "{}"
            ) as TBTCLocalStorageDepositData
          )
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.ProvideData,
            })
          )
        } else {
          // UTXO exists for a given Bitcoin deposit address and deposit is not
          // yet revealed. Redirect to step 3 to reveal the deposit and set
          // utxo.

          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "utxo",
              value: {
                ...utxo,
                transactionHash: utxo.transactionHash.toString(),
                value: utxo.value.toString(),
              },
            })
          )
          listenerApi.dispatch(
            tbtcSlice.actions.updateState({
              key: "mintingStep",
              value: MintingStep.InitiateMinting,
            })
          )
        }
      }
    } catch (err) {
      if (!(err instanceof TaskAbortError)) {
        console.error(`Failed to fetch utxo for ${btcDepositAddress}.`, err)
      }
    }
  })

  await listenerApi.condition((action) => {
    if (!tbtcSlice.actions.updateState.match(action)) return false

    const { key, value } = (
      action as ReturnType<typeof tbtcSlice.actions.updateState>
    ).payload
    return key === "mintingStep" && value !== MintingStep.Deposit
  })

  // Stop polling task.
  pollingTask.cancel()
}

export const fetchUtxoConfirmationsEffect = async (
  action: ReturnType<typeof tbtcSlice.actions.fetchUtxoConfirmations>,
  listenerApi: AppListenerEffectAPI
) => {
  const { utxo } = action.payload
  const {
    tbtc: { depositDetails },
  } = listenerApi.getState()
  const confirmations = depositDetails.data?.confirmations

  if (!utxo) return

  const minimumNumberOfConfirmationsNeeded =
    listenerApi.extra.threshold.tbtc.minimumNumberOfConfirmationsNeeded(
      utxo.value
    )

  if (confirmations && confirmations >= minimumNumberOfConfirmationsNeeded)
    return

  // Cancel any in-progress instances of this listener.
  listenerApi.cancelActiveListeners()

  const pollingTask = listenerApi.fork(async (forkApi) => {
    try {
      while (true) {
        // Get confirmations
        const confirmations = await forkApi.pause(
          listenerApi.extra.threshold.tbtc.getTransactionConfirmations(
            utxo.transactionHash
          )
        )
        listenerApi.dispatch(
          tbtcSlice.actions.updateDepositDetailsDataState({
            key: "confirmations",
            value: confirmations,
          })
        )
        await forkApi.delay(10 * ONE_SEC_IN_MILISECONDS)
      }
    } catch (err) {
      if (!(err instanceof TaskAbortError)) {
        console.error(
          `Failed to sync confirmation for transaction: ${utxo.transactionHash}.`,
          err
        )
      }
    }
  })

  await listenerApi.condition((action) => {
    // stop listening for confirmations if deposit details data is cleared
    if (tbtcSlice.actions.clearDepositDetailsData.match(action)) return true
    if (!tbtcSlice.actions.updateDepositDetailsDataState.match(action))
      return false

    const { key, value } = (
      action as ReturnType<
        typeof tbtcSlice.actions.updateDepositDetailsDataState
      >
    ).payload
    return (
      key === "confirmations" && value >= minimumNumberOfConfirmationsNeeded
    )
  })

  // Stop polling task.
  pollingTask.cancel()
}
