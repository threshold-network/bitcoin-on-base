import React, { createContext } from "react"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
import { useWeb3React } from "@web3-react/core"
import { useT } from "../web3/hooks/useT"
import { useTokenState } from "../hooks/useTokenState"
import { useTokensBalanceCall } from "../hooks/useTokensBalanceCall"
import { Token } from "../enums"
import { TokenState } from "../types"
import { useTBTCTokenContract } from "../web3/hooks"
import { useFetchOwnerStakes } from "../hooks/useFetchOwnerStakes"
import { useTBTCv2TokenContract } from "../web3/hooks/useTBTCv2TokenContract"
import { featureFlags } from "../constants"

interface TokenContextState extends TokenState {
  contract: Contract | null
}

export const TokenContext = createContext<{
  [key in Token]: TokenContextState
}>({
  [Token.T]: {} as TokenContextState,
  [Token.TBTC]: {} as TokenContextState,
  [Token.TBTCV2]: {} as TokenContextState,
})

// Context that handles data fetching when a user connects their wallet or
// switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const t = useT()
  const tbtc = useTBTCTokenContract()
  const tbtcv2 = useTBTCv2TokenContract()
  const { active, chainId, account } = useWeb3React()
  const fetchOwnerStakes = useFetchOwnerStakes()

  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenConversionRate,
    t: tData,
    tbtc: tbtcData,
    tbtcv2: tbtcv2Data,
  } = useTokenState()

  const tokenContracts = [featureFlags.TBTC_V2 && tbtcv2, t.contract].filter(
    (conract) => !!conract
  ) as Contract[]

  if (featureFlags.TBTC_V2) tokenContracts.push(tbtcv2)

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
      fetchBalances().then(([tbtcv2Balance, tBalance]) => {
        setTokenBalance(Token.T, tBalance.toString())
        if (featureFlags.TBTC_V2) {
          setTokenBalance(Token.TBTCV2, tbtcv2Balance.toString())
        }
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

  // fetch user stakes when they connect their wallet
  React.useEffect(() => {
    fetchOwnerStakes(account!)
  }, [fetchOwnerStakes, account])

  return (
    <TokenContext.Provider
      value={{
        [Token.T]: {
          ...t,
          ...tData,
        },
        [Token.TBTC]: {
          ...tbtc,
          ...tbtcData,
        },
        [Token.TBTCV2]: {
          contract: tbtcv2,
          ...tbtcv2Data,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
