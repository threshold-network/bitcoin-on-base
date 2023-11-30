import { ModalType } from "../enums"
import { ElementType } from "react"
import SelectWalletModal from "../components/Modal/SelectWalletModal"
import {
  TransactionFailed,
  TransactionIsPending,
  TransactionIsWaitingForConfirmation,
} from "../components/Modal/TransactionModal"
import TbtcRecoveryFileModalModal from "../components/Modal/TbtcRecoveryFileModal"
import TbtcMintingConfirmationModal from "../components/Modal/TbtcMintingConfirmationModal"
import AnalyticsModal from "../components/Modal/AnalyticsModal"
import {
  GenerateNewDepositAddress,
  InitiateUnminting,
  NewTBTCApp,
} from "../components/Modal/tBTC"
import FeedbackSubmissionModal from "../components/Modal/FeedbackSubmissionModal"

export const MODAL_TYPES: Record<ModalType, ElementType> = {
  [ModalType.SelectWallet]: SelectWalletModal,
  [ModalType.TransactionIsPending]: TransactionIsPending,
  [ModalType.TransactionIsWaitingForConfirmation]:
    TransactionIsWaitingForConfirmation,
  [ModalType.TransactionFailed]: TransactionFailed,
  [ModalType.TbtcRecoveryJson]: TbtcRecoveryFileModalModal,
  [ModalType.TbtcMintingConfirmation]: TbtcMintingConfirmationModal,
  [ModalType.Analytics]: AnalyticsModal,
  [ModalType.NewTBTCApp]: NewTBTCApp,
  [ModalType.FeedbackSubmission]: FeedbackSubmissionModal,
  [ModalType.GenerateNewDepositAddress]: GenerateNewDepositAddress,
  [ModalType.InitiateUnminting]: InitiateUnminting,
}

export interface BaseModalProps {
  closeModal: () => void
}

export interface OpenModal {
  payload: {
    modalType: ModalType
    props: any
  }
}

export interface CloseModal {}

export type ModalActionTypes = OpenModal | CloseModal

export interface UseModal {
  (): {
    modalType: ModalType | null
    modalProps: any
    openModal: (type: ModalType, props?: any) => ModalActionTypes
    closeModal: () => ModalActionTypes | void
  }
}
