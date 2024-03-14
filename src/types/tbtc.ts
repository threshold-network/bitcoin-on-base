import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { FetchingState } from "."
import { BridgeActivity, BridgeProcess } from "../threshold-ts/tbtc"
import { UpdateStateActionPayload } from "./state"

export interface TbtcState {
  mintingStep: MintingStep
  depositDetailsStep: DepositDetailsStep
  // deposit data
  btcRecoveryAddress: string
  btcDepositAddress: string
  ethAddress: string
  refundLocktime: string
  blindingFactor: string
  walletPublicKeyHash: string
  utxo: BitcoinUtxo
  nextBridgeCrossingInUnix?: number
  depositRevealedTxHash?: string
  tBTCMintAmount: string
  thresholdNetworkFee: string
  mintingFee: string

  bridgeActivity: FetchingState<BridgeActivity[]>
  depositDetails: FetchingState<DepositDetailsDataState | undefined> & {
    depositKey: string
  }
}

type DepositDetailsDataState = DepositDetailsData & {
  optimisticMintingRequestedTxHashFromEvent?: string
  optimisticMintingFinalizedTxHashFromEvent?: string
}

export interface DepositDetailsData {
  depositRevealedTxHash: string
  amount: string
  btcTxHash: string
  optimisticMintingRequestedTxHash?: string
  optimisticMintingFinalizedTxHash?: string
  confirmations: number
  requiredConfirmations: number
  treasuryFee: string
  optimisticMintFee: string
}

export type TbtcStateKey = keyof Omit<TbtcState, "bridgeActivity">

export type DepositDetailsDataStateKey = keyof DepositDetailsDataState

export enum MintingStep {
  ProvideData = "PROVIDE_DATA",
  Deposit = "DEPOSIT",
  InitiateMinting = "INITIATE_MINTING",
  MintingSuccess = "MINTING_SUCCESS",
}

export const MintingSteps: MintingStep[] = [
  MintingStep.ProvideData,
  MintingStep.Deposit,
  MintingStep.InitiateMinting,
  MintingStep.MintingSuccess,
]

export interface UpdateTbtcState {
  payload: UpdateStateActionPayload<TbtcStateKey>
}

export interface UpdateDepositDetailsState {
  payload: UpdateStateActionPayload<DepositDetailsDataStateKey>
}

export interface UseTbtcState {
  (): {
    updateState: (key: TbtcStateKey, value: any) => UpdateTbtcState
    updateDepositDetailsDataState: (
      key: DepositDetailsDataStateKey,
      value: any
    ) => UpdateDepositDetailsState
    resetDepositData: () => void
  } & TbtcState
}

export { type BridgeProcess }

export enum DepositDetailsStep {
  BitcoinConfirmations = "bitcoin-confirmations",
  MintingInitialized = "minting-initialized",
  GuardianCheck = "guardian-check",
  MintingCompleted = "minting-completed",
  Completed = "completed",
}

export const DepositDetailsSteps: DepositDetailsStep[] = [
  DepositDetailsStep.BitcoinConfirmations,
  DepositDetailsStep.MintingInitialized,
  DepositDetailsStep.GuardianCheck,
  DepositDetailsStep.MintingCompleted,
  DepositDetailsStep.Completed,
]
