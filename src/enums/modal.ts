export enum ModalType {
  SelectWallet = "SELECT_WALLET",
  TransactionIsPending = "TRANSACTION_IS_PENDING",
  TransactionIsWaitingForConfirmation = "TRANSACTION_IS_WAITING_FOR_CONFIRMATION",
  TransactionFailed = "TRANSACTION_FAILED",
  TbtcRecoveryJson = "TBTC_RECOVERY_JSON",
  TbtcMintingConfirmation = "TBTC_MINTING_CONFIRMATION",
  Analytics = "ANALYTICS",
  NewTBTCApp = "NEW_TBTC_APP",
  FeedbackSubmission = "FEEDBACK_SUBMIT",
  GenerateNewDepositAddress = "TBTC_GENERATE_NEW_DEPOSIT_ADDRESS",
  InitiateUnminting = "INITIATE_UNMINTING",
}
