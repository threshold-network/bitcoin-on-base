import { useDispatch } from "react-redux"
import { setTransactionStatus as setTransactionStatusAction } from "../store/transactions"
import { UseTransaction } from "../types/transaction"
import { TransactionStatus, TransactionType } from "../enums/transactionType"

export const useTransaction: UseTransaction = () => {
  const dispatch = useDispatch()

  const setTransactionStatus = (
    type: TransactionType,
    status: TransactionStatus
  ) => dispatch(setTransactionStatusAction({ type, status }))

  return {
    setTransactionStatus,
  }
}
