import { useCallback } from "react"
import { RootState } from "../store"
import {
  updateState as updateStateAction,
  updateDepositDetailsDataState as updateDepositDetailsDataStateAction,
} from "../store/tbtc"
import { useAppDispatch, useAppSelector } from "./store"
import {
  DepositDetailsDataStateKey,
  MintingStep,
  TbtcStateKey,
  UseTbtcState,
} from "../types/tbtc"

export const useTbtcState: UseTbtcState = () => {
  const tbtcState = useAppSelector((state: RootState) => state.tbtc)
  const dispatch = useAppDispatch()

  const updateState = useCallback(
    (key: TbtcStateKey, value: any) =>
      dispatch(updateStateAction({ key, value })),
    [dispatch]
  )

  const updateDepositDetailsDataState = useCallback(
    (key: DepositDetailsDataStateKey, value: any) =>
      dispatch(updateDepositDetailsDataStateAction({ key, value })),
    [dispatch]
  )

  const resetDepositData = useCallback(() => {
    updateState("ethAddress", undefined)
    updateState("blindingFactor", undefined)
    updateState("btcRecoveryAddress", undefined)
    updateState("walletPublicKeyHash", undefined)
    updateState("refundLocktime", undefined)
    updateState("btcDepositAddress", undefined)
    updateState("mintingStep", MintingStep.ProvideData)
    updateState("tBTCMintAmount", undefined)
    updateState("thresholdNetworkFee", undefined)
    updateState("mintingFee", undefined)
    updateState("utxo", undefined)
    updateState("depositRevealedTxHash", undefined)
  }, [updateState])

  return {
    ...tbtcState,
    updateState,
    updateDepositDetailsDataState,
    resetDepositData,
  }
}
