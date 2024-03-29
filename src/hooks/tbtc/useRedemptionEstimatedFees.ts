import { useEffect, useState } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useRedemptionEstimatedFees = (unmintedAmount: string) => {
  const threshold = useThreshold()
  const [estimatedBTCAmount, setEstimatedBTCAmount] = useState<
    string | undefined
  >(undefined)
  const [thresholdNetworkFee, setThresholdNetworkFee] = useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    const getEstimatedRedemptionFees = async () => {
      const { treasuryFee, estimatedAmountToBeReceived } =
        await threshold.tbtc.getEstimatedRedemptionFees(unmintedAmount)

      setThresholdNetworkFee(treasuryFee)
      setEstimatedBTCAmount(estimatedAmountToBeReceived)
    }

    getEstimatedRedemptionFees()
  }, [unmintedAmount, threshold])

  return { estimatedBTCAmount, thresholdNetworkFee }
}
