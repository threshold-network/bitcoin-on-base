import { useCallback } from "react"
import { BigNumber } from "ethers"
import { useTStakingContract } from "./useTStakingContract"
import { isAddressZero } from "../../web3/utils"
import { useThreshold } from "../../contexts/ThresholdContext"

const useCheckDuplicateProviderAddress = (): ((
  stakingProvider: string
) => Promise<{
  isProviderUsedForT: boolean
}>) => {
  const tStakingContract = useTStakingContract()
  const threshold = useThreshold()

  const checkIfProviderUsed = useCallback(
    async (stakingProvider) => {
      if (!tStakingContract) {
        throw new Error(
          "The request cannot be executed because the contract instances do not exist."
        )
      }

      const [{ owner }] = await threshold.multicall.aggregate([
        {
          interface: tStakingContract.interface,
          address: tStakingContract.address,
          method: "rolesOf",
          args: [stakingProvider],
        },
      ])
      const isProviderUsedForT = !isAddressZero(owner)

      return { isProviderUsedForT }
    },
    [tStakingContract, threshold]
  )

  return checkIfProviderUsed
}

export default useCheckDuplicateProviderAddress
