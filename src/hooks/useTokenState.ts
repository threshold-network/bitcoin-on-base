import { useSelector, useDispatch } from "react-redux"
import {
  setTokenBalance as setTokenBalanceAction,
  setTokenLoading as setTokenLoadingAction,
  fetchTokenPriceUSD as fetchTokenPriceAction,
  setTokenConversionRate as setTokenConversionRateAction,
} from "../store/tokens"
import { RootState } from "../store"
import { Token } from "../enums"
import { UseTokenState } from "../types/token"

export const useTokenState: UseTokenState = () => {
  const t = useSelector((state: RootState) => state.token[Token.T])
  const tbtc = useSelector((state: RootState) => state.token[Token.TBTC])
  const tbtcv2 = useSelector((state: RootState) => state.token[Token.TBTCV2])

  const dispatch = useDispatch()

  const setTokenConversionRate = (
    token: Token,
    conversionRate: number | string
  ) => dispatch(setTokenConversionRateAction({ token, conversionRate }))

  const setTokenBalance = (token: Token, balance: number | string) =>
    dispatch(setTokenBalanceAction({ token, balance }))

  const setTokenLoading = (token: Token, loading: boolean) =>
    dispatch(setTokenLoadingAction({ token, loading }))

  const fetchTokenPriceUSD = (token: Token) =>
    dispatch(fetchTokenPriceAction({ token }))

  return {
    t,
    tbtc,
    tbtcv2,
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenLoading,
    setTokenConversionRate,
  }
}
