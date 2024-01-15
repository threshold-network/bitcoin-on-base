import { useState, useCallback, useMemo } from "react"
import { BigNumberish } from "ethers"
import { formatUnits } from "@ethersproject/units"
import { useMulticall } from "../web3/hooks"
import { useToken } from "./useToken"
import { Token } from "../enums"
import { toUsdBalance } from "../utils/getUsdBalance"

interface TvlRawData {
  tBTC: string
}

interface TvlData {
  tBTC: string
}

const initialState = {
  tBTC: "0",
}

export const useFetchTvl = (): [
  TvlData,
  () => Promise<TvlRawData>,
  TvlRawData
] => {
  const [rawData, setRawData] = useState<TvlRawData>(initialState)
  const { tBTC: tBTCTvl } = rawData

  const tBTCToken = useToken(Token.TBTCV2)

  // TODO: No need to use `useMulticall` here
  const fetchOnChainData = useMulticall([
    {
      address: tBTCToken.contract?.address!,
      interface: tBTCToken.contract?.interface!,
      method: "totalSupply",
    },
  ])

  const fetchTvlData = useCallback(async () => {
    const chainData = await fetchOnChainData()
    if (chainData.length === 0) return initialState

    const [tBTCTokenTotalSupply] = chainData.map((amount: BigNumberish) =>
      amount.toString()
    )

    const data: TvlRawData = {
      tBTC: tBTCTokenTotalSupply,
    }
    setRawData(data)

    return data
  }, [fetchOnChainData])

  const data = useMemo(() => {
    const tBTCUSD = toUsdBalance(formatUnits(tBTCTvl), tBTCToken.usdConversion)

    return {
      tBTC: tBTCUSD.toString(),
    } as TvlData
  }, [tBTCTvl, tBTCToken.usdConversion])

  return [data, fetchTvlData, rawData]
}
