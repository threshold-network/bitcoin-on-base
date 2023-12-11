import { Box, Flex, Skeleton, Stack } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FC, useEffect } from "react"
import { BridgeContractLink } from "../../../../components/tBTC"
import { useIsTbtcSdkInitializing } from "../../../../contexts/ThresholdContext"
import { ModalType } from "../../../../enums"
import { useAppDispatch } from "../../../../hooks/store"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useModal } from "../../../../hooks/useModal"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { tbtcSlice } from "../../../../store/tbtc"
import { MintingStep } from "../../../../types/tbtc"
import { InitiateMinting } from "./InitiateMinting"
import { MakeDeposit } from "./MakeDeposit"
import { MintingSuccess } from "./MintingSuccess"
import { ProvideData } from "./ProvideData"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { mintingStep, updateState, btcDepositAddress, utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()
  const { isSdkInitializing, isSdkInitializedWithSigner } =
    useIsTbtcSdkInitializing()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
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
      return <ProvideData onPreviousStepClick={onPreviousStepClick} />
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

export const MintingFlowRouter: FC = () => {
  return (
    <Flex flexDirection="column">
      <>
        <MintingFlowRouterBase />
        <Box as="p" textAlign="center" mt="6">
          <BridgeContractLink />
        </Box>
      </>
    </Flex>
  )
}
