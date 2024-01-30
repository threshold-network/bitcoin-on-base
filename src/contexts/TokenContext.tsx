import { AddressZero } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import React, { createContext } from "react"
import { useTokenState } from "../hooks/useTokenState"
import { useTokensBalanceCall } from "../hooks/useTokensBalanceCall"
import { Token } from "../enums"
import { TokenState } from "../types"
import { useTBTCTokenContract } from "../web3/hooks/useTBTCTokenContract"

interface TokenContextState extends TokenState {
  contract: Contract | null
}

export const TokenContext = createContext<{
  [key in Token]: TokenContextState
}>({
  [Token.TBTC]: {} as TokenContextState,
})

// Context that handles data fetching when a user connects their wallet or
// switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const tbtc = useTBTCTokenContract()
  const { active, chainId, account } = useWeb3React()

  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    tbtc: tbtcData,
  } = useTokenState()

  const tokenContracts = [tbtc]

  const fetchBalances = useTokensBalanceCall(
    tokenContracts,
    active ? account! : AddressZero
  )

  //
  // SET USD PRICE
  //
  React.useEffect(() => {
    for (const token in Token) {
      if (token) {
        // @ts-ignore
        fetchTokenPriceUSD(Token[token])
      }
    }
  }, [])

  //
  // FETCH BALANCES ON WALLET LOAD OR NETWORK SWITCH
  //
  React.useEffect(() => {
    if (active) {
      fetchBalances().then(([tbtcBalance]) => {
        setTokenBalance(Token.TBTC, tbtcBalance.toString())
      })
    } else {
      // set all token balances to 0 if the user disconnects the wallet
      for (const token in Token) {
        if (token) {
          // @ts-ignore
          setTokenBalance(Token[token], 0)
        }
      }
    }
  }, [active, chainId, account])

  return (
    <TokenContext.Provider
      value={{
        [Token.TBTC]: {
          contract: tbtc,
          ...tbtcData,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
