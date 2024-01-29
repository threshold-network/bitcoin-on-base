import { Token } from "../enums"

export interface TokenState {
  loading: boolean
  text: string
  icon: any
  balance: number | string
  usdConversion: number
  usdBalance: string
  decimals?: number
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number | string
}

export interface SetTokenLoadingActionPayload {
  token: Token
  loading: boolean
}

export interface SetTokenBalance {
  payload: SetTokenBalanceActionPayload
}

export interface SetTokenLoading {
  payload: SetTokenLoadingActionPayload
}

export type TokenActionTypes = SetTokenBalance | SetTokenLoading

export interface UseTokenState {
  (): {
    tbtc: TokenState
    setTokenBalance: (
      token: Token,
      balance: number | string
    ) => TokenActionTypes
    setTokenLoading: (token: Token, loading: boolean) => TokenActionTypes
    fetchTokenPriceUSD: (token: Token) => void
  }
}
