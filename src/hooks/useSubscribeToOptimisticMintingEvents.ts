import { useState } from "react"
import {
  useSubscribeToOptimisticMintingRequestedEventBase,
  useSubscribeToOptimisticMintingFinalizedEventBase,
} from "./tbtc"

export const useSubscribeToOptimisticMintingEvents = (depositKey?: string) => {
  const [
    optimisticMintingRequestedTxHash,
    setOptimisticMintingRequestedTxHash,
  ] = useState("")
  const [
    optimisticMintingFinalizedTxHash,
    setOptimisticMintingFinalizedTxHashTxHash,
  ] = useState("")

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
        setOptimisticMintingRequestedTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (minter, depositKeyEventParam, depositor, optimisticMintingDebt, event) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        setOptimisticMintingFinalizedTxHashTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  return { optimisticMintingRequestedTxHash, optimisticMintingFinalizedTxHash }
}
