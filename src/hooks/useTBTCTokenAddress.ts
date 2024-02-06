import { useTBTCTokenContract } from "../web3/hooks/useTBTCTokenContract"

export const useTBTCTokenAddress = () => {
  const tbtcContract = useTBTCTokenContract()

  return tbtcContract.address
}
