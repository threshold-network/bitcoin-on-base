import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { MintingStep } from "../../types/tbtc"
import { useThreshold } from "../../contexts/ThresholdContext"

type OptimisticMintingRequestedEventCallback = (
  minter: string,
  depositKey: BigNumber,
  depositor: string,
  amount: BigNumber,
  fundingTxHash: unknown,
  fundingOutputIndex: BigNumber,
  event: Event
) => void

const useSubscribeToOptimisticMintingRequestedEventBase = (
  callback: OptimisticMintingRequestedEventCallback,
  filterParams?: any[string],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tbtcVaultContract = useTBTCVaultContract()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingRequested",
    //@ts-ignore
    callback,
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}

/**
 * Subscribes to optimistic minting requested events based on the deposit key.
 * This is used to update the deposit details data state needed for Deposit
 * Details page.
 * @param {string} depositKey String representing the deposit key.
 */
export const useSubscribeToOptimisticMintingRequestedEvent = (
  depositKey?: string
) => {
  const { updateDepositDetailsDataState } = useTbtcState()

  useSubscribeToOptimisticMintingRequestedEventBase(
    (
      minter,
      depositKeyEventParam,
      depositor,
      amount,
      fundingTxHash,
      fundingOutputIndex,
      event
    ) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        updateDepositDetailsDataState(
          "optimisticMintingRequestedTxHashFromEvent",
          event.transactionHash
        )
      }
    },
    undefined,
    true
  )
}
