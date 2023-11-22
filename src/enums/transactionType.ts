export enum TransactionType {
  ApproveT = "APPROVE_T",
}

export enum TransactionStatus {
  Idle = "IDLE",
  PendingWallet = "PENDING_WALLET",
  PendingOnChain = "PENDING_ON_CHAIN",
  Rejected = "REJECTED",
  Failed = "FAILED",
  Succeeded = "SUCCEEDED",
}
