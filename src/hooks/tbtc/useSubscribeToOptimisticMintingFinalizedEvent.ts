import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { tbtcSlice } from "../../store/tbtc"
import { useAppDispatch } from "../store"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { useThreshold } from "../../contexts/ThresholdContext"

type OptimisticMintingFinalizedEventCallback = (
  minter: string,
  depositKey: BigNumber,
  depositor: string,
  optimisticMintingDebt: BigNumber,
  event: Event
) => void

export const useSubscribeToOptimisticMintingFinalizedEventBase = (
  callback: OptimisticMintingFinalizedEventCallback,
  filterParams?: any[],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tbtcVaultContract = useTBTCVaultContract()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingFinalized",
    //@ts-ignore
    callback,
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}

/**
 * Subscribes to optimistic minting finalized events based on the deposit key.
 * This is used to update the deposit details data state needed for Deposit
 * Details page.
 * @param {string} depositKey String representing the deposit key.
 */
export const useSubscribeToOptimisticMintingFinalizedEvent = (
  depositKey?: string
) => {
  const { updateDepositDetailsDataState } = useTbtcState()

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (minter, depositKeyEventParam, depositor, optimisticMintingDebt, event) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        updateDepositDetailsDataState(
          "optimisticMintingFinalizedTxHashFromEvent",
          event.transactionHash
        )
      }
    },
    undefined,
    true
  )
}

/**
 * Subscribes to optimistic minting finalized events based on the currently
 * connected account. This is used to update the bridge activity state (for the
 * current account) when the optimistic minting is finalized.
 */
export const useSubscribeToOptimisticMintingFinalizedEventForCurrentAccount =
  () => {
    const threshold = useThreshold()
    const { utxo } = useTbtcState()
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()

    useSubscribeToOptimisticMintingFinalizedEventBase(
      (...args) => {
        const [, depositKey, , , event] = args
        const depositKeyFromEvent = depositKey.toHexString()
        const depositKeyFromUTXO = utxo
          ? threshold.tbtc.buildDepositKey(
              utxo.transactionHash.toString(),
              utxo.outputIndex,
              "big-endian"
            )
          : ""

        // Updates bridge activity state if the deposit key from the event matches
        dispatch(
          tbtcSlice.actions.optimisticMintingFinalized({
            depositKey: depositKeyFromEvent,
            txHash: event.transactionHash,
          })
        )
      },
      [null, null, account]
    )
  }
