import { FC, useEffect } from "react"
import { Box, H5, useColorModeValue } from "@threshold-network/components"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import {
  ProtocolHistoryRecentDeposits,
  ProtocolHistoryTitle,
  ProtocolHistoryViewMoreLink,
  Tvl,
} from "../../../../components/tBTC"
import { useFetchRecentDeposits } from "../../../../hooks/tbtc"
import { useFetchTvl } from "../../../../hooks/useFetchTvl"
import { BridgeProcess } from "../../../../types"

export const BridgeProcessEmptyState: FC<{
  title: string
  bridgeProcess?: BridgeProcess
}> = ({ title }) => {
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()
  const [deposits] = useFetchRecentDeposits(3)
  const protocolHistoryBackgroundColor = useColorModeValue(
    "linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 117.78%)",
    "linear-gradient(360deg, #333A47 0%, rgba(255, 255, 255, 0) 117.78%)"
  )

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <Box mx={{ base: 0, lg: 10 }}>
      {/* <BridgeProcessCardTitle bridgeProcess={bridgeProcess} /> */}
      <H5 align={"center"}>{title}</H5>
      <SubmitTxButton mb="6" mt="4" />
    </Box>
  )
}
