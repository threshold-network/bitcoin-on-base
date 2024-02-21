import { FC, useEffect } from "react"
import { Skeleton, Stack, VStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import {
  MintingStep,
  MintingSteps as mintingSteps,
} from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { useIsTbtcSdkInitializing } from "../../../../contexts/ThresholdContext"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { mintingStep, updateState, btcDepositAddress, utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()
  const { isSdkInitializing, isSdkInitializedWithSigner } =
    useIsTbtcSdkInitializing()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (mintingStep === MintingStep.ProvideData) {
      previousStep = MintingStep.ProvideData
    }
    if (!previousStep) {
      const previousStepIndex = mintingSteps.indexOf(mintingStep) - 1
      previousStep = mintingSteps[previousStepIndex] as MintingStep
    }
    if (mintingStep === MintingStep.MintingSuccess) {
      updateState("mintingStep", MintingStep.ProvideData)
      removeDepositData()
      return
    }
    if (previousStep === MintingStep.ProvideData) {
      openModal(ModalType.GenerateNewDepositAddress)
      return
    }
    updateState("mintingStep", previousStep)
  }

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
      return <MakeDeposit onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.InitiateMinting: {
      return (
        <InitiateMinting
          utxo={utxo!}
          onPreviousStepClick={() =>
            onPreviousStepClick(MintingStep.ProvideData)
          }
        />
      )
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return (
        <>
          <Stack>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="100px" />
          </Stack>
        </>
      )
  }
}

export const MintingFlowRouter: FC = () => {
  return (
    <VStack spacing={8} align="stretch">
      <MintingFlowRouterBase />
    </VStack>
  )
}
