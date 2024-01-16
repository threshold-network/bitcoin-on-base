import { useThreshold } from "../../contexts/ThresholdContext"

export const useTBTCTokenContract = () => {
  const threshold = useThreshold()
  return threshold.tbtc.tokenContract
}
