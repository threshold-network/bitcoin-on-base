import { Skeleton, Stack } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import { useIsTbtcSdkInitializing } from "../../../../contexts/ThresholdContext"
import { useAppDispatch } from "../../../../hooks/store"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { tbtcSlice } from "../../../../store/tbtc"
import { MintingStep } from "../../../../types/tbtc"
import { InitiateMinting } from "./InitiateMinting"
import { MakeDeposit } from "./MakeDeposit"
import { MintingSuccess } from "./MintingSuccess"
import { ProvideData } from "./ProvideData"

export const MintingFlowRouter = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { mintingStep, btcDepositAddress, utxo } = useTbtcState()
  const { isSdkInitializing, isSdkInitializedWithSigner } =
    useIsTbtcSdkInitializing()

  useEffect(() => {
    if (
      !btcDepositAddress ||
      !account ||
      isSdkInitializing ||
      !isSdkInitializedWithSigner
    ) {
      return
    }
    dispatch(
      tbtcSlice.actions.findUtxo({ btcDepositAddress, depositor: account })
    )
  }, [
    btcDepositAddress,
    account,
    dispatch,
    isSdkInitializing,
    isSdkInitializedWithSigner,
  ])

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit />
    }
    case MintingStep.InitiateMinting: {
      return <InitiateMinting utxo={utxo!} />
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="100px" />
        </Stack>
      )
  }
}
