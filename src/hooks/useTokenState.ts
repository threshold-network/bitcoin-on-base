import { useSelector, useDispatch } from "react-redux"
import {
  setTokenBalance as setTokenBalanceAction,
  setTokenLoading as setTokenLoadingAction,
  fetchTokenPriceUSD as fetchTokenPriceAction,
} from "../store/tokens"
import { RootState } from "../store"
import { Token } from "../enums"
import { UseTokenState } from "../types/token"

export const useTokenState: UseTokenState = () => {
  const tbtc = useSelector((state: RootState) => state.token[Token.TBTC])

  const dispatch = useDispatch()

  const setTokenBalance = (token: Token, balance: number | string) =>
    dispatch(setTokenBalanceAction({ token, balance }))

  const setTokenLoading = (token: Token, loading: boolean) =>
    dispatch(setTokenLoadingAction({ token, loading }))

  const fetchTokenPriceUSD = (token: Token) =>
    dispatch(fetchTokenPriceAction({ token }))

  return {
    tbtc,
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenLoading,
  }
}
