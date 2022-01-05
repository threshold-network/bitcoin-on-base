import { useCallback } from "react"
import { MaxUint256 } from "@ethersproject/constants"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "./useContract"
import ERC20_ABI from "../abi/ERC20.json"
import { Token } from "../../enums"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Approve, UseErc20Interface } from "../../types/token"
import { useTransaction } from "../../hooks/useTransaction"
import { TransactionStatus } from "../../enums/transactionType"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"
import { once } from "@storybook/node-logger"

export const useErc20TokenContract: UseErc20Interface = (
  tokenAddress,
  withSignerIfPossible,
  abi = ERC20_ABI
) => {
  const { account } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()
  const { setTransactionStatus } = useTransaction()

  // TODO: Figure out how to type the ERC20 contract
  // return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
  const contract = useContract(tokenAddress, abi, withSignerIfPossible)

  const approve: Approve = useCallback(
    async (transactionType) => {
      console.log("attemping to approve T")
      if (account) {
        try {
          setTransactionStatus(transactionType, TransactionStatus.PendingWallet)
          console.log("set the tx type to pending wallet")
          const tx = await contract?.approve(
            tokenAddress,
            MaxUint256.toString()
          )
          console.log("got the tx", tx)
          setTransactionStatus(
            transactionType,
            TransactionStatus.PendingOnChain
          )
          await tx.wait(1)
          setTransactionStatus(transactionType, TransactionStatus.Succeeded)
        } catch (error: any) {
          setTransactionStatus(
            transactionType,
            isWalletRejectionError(error)
              ? TransactionStatus.Rejected
              : TransactionStatus.Failed
          )
        }
      }
    },
    [contract, account]
  )

  const balanceOf = useCallback(
    async (token: Token) => {
      if (account) {
        try {
          setTokenLoading(token, true)
          console.log("using ", contract)
          const balance = await contract?.balanceOf(account as string)
          console.log("got the token balance", balance)
          // TODO do not hard code decimals
          // const balance = rawWalletBalance / 10 ** 18

          setTokenBalance(token, balance.toString())
          setTokenLoading(token, false)
        } catch (error) {
          setTokenLoading(Token.Nu, false)
          console.log(
            `Error: Fetching ${token} balance failed for ${account}`,
            error
          )
        }
      }
    },
    [account, contract]
  )

  return { approve, balanceOf, contract }
}
