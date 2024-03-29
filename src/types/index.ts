export * from "./array"
export * from "./modal"
export * from "./wallet"
export * from "./token"
export * from "./page"
export * from "./tbtc"

export type FetchingState<DataType> = {
  isInitialFetchDone?: boolean
  isFetching: boolean
  error: string
  data: DataType
}

export type RangeOperatorType =
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual"

export type CurrencyType = "BTC" | "ETH" | "tBTC" | "SOL"
