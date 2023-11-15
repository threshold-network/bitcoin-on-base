// TODO: Refactor this so that it's only imported in our threshold-ts lib
import { Hex } from "tbtc-sdk-v2"
import { Event } from "ethers"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useBridgeContract } from "./useBridgeContract"

type RedemptionsCompletedEventCallback = (
  walletPublicKeyHash: string,
  redemptionTxHash: string,
  event: Event
) => void

export const useSubscribeToRedemptionsCompletedEventBase = (
  callback: RedemptionsCompletedEventCallback,
  filterParams?: any[],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tBTCBridgeContract = useBridgeContract()

  useSubscribeToContractEvent(
    tBTCBridgeContract,
    "RedemptionsCompleted",
    //@ts-ignore
    (walletPublicKeyHash, redemptionTxHash, event) => {
      callback(
        walletPublicKeyHash,
        Hex.from(redemptionTxHash).reverse().toString(),
        event
      )
    },
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}
