import { useState, useCallback, useMemo } from "react"
import { BigNumberish } from "ethers"
import { formatUnits } from "@ethersproject/units"
import { useToken } from "./useToken"
import { Token } from "../enums"
import { toUsdBalance } from "../utils/getUsdBalance"
import { useTBTCv2TokenContract } from "../web3/hooks/useTBTCv2TokenContract"

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

  const tbtcTokenContract = useTBTCv2TokenContract()
  const tBTCToken = useToken(Token.TBTCV2)

  const fetchTvlData = useCallback(async () => {
    const tBTCTokenTotalSupply: BigNumberish =
      await tbtcTokenContract.totalSupply()
    if (!tBTCTokenTotalSupply) return initialState

    const data: TvlRawData = {
      tBTC: tBTCTokenTotalSupply.toString(),
    }
    setRawData(data)

    return data
  }, [])

  const data = useMemo(() => {
    const tBTCUSD = toUsdBalance(formatUnits(tBTCTvl), tBTCToken.usdConversion)

    return {
      tBTC: tBTCUSD.toString(),
    } as TvlData
  }, [tBTCTvl, tBTCToken.usdConversion])

  return [data, fetchTvlData, rawData]
}
