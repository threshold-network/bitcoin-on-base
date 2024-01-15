export * from "./array"
export * from "./modal"
export * from "./wallet"
export * from "./sidebar"
export * from "./token"
export * from "./eth"
export * from "./page"
export * from "./rewards"
export * from "./tbtc"

export type FetchingState<DataType> = {
  isInitialFetchDone?: boolean
  isFetching: boolean
  error: string
  data: DataType
}
