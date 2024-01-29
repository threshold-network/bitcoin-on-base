import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import {
  BodyMd,
  BodySm,
  Box,
  Button,
  H5,
  HStack,
  Link,
  VStack,
} from "@threshold-network/components"
import { FC, useEffect, useState } from "react"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import MintingTransactionDetails from "../components/MintingTransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BigNumber } from "ethers"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useRevealDepositTransaction } from "../../../../hooks/tbtc"
import { useModal } from "../../../../hooks/useModal"
import { getDurationByNumberOfConfirmations } from "../../../../utils/tBTC"
import { FaClock as ClockIcon } from "react-icons/fa"
import { LabeledBadge } from "../../../../components/LabeledBadge"
import { Toast } from "../../../../components/Toast"

type RevealDepositErrorType = {
  code: number
  message: string
}

const InitiateMintingComponent: FC<{
  utxo: BitcoinUtxo
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const threshold = useThreshold()
  const { closeModal } = useModal()
  const [depositRevealErrorData, setDepositRevealErrorData] =
    useState<RevealDepositErrorType>()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    // We don't have success modal for deposit reveal so we just closing the
    // current TransactionIsPending modal.
    closeModal()
  }

  const onFailedDepositReveal = (error: RevealDepositErrorType) => {
    setDepositRevealErrorData(error)
    console.log("Failed to reveal deposit", error)
    closeModal()
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal,
    onFailedDepositReveal
  )

  const depositedAmount = BigNumber.from(utxo.value).toString()
  const confirmations = threshold.tbtc.minimumNumberOfConfirmationsNeeded(
    utxo.value
  )
  const durationInMinutes = getDurationByNumberOfConfirmations(confirmations)
  // Round up the minutes to the nearest half-hour
  const hours = (Math.round(durationInMinutes / 30) * 30) / 60

  const hoursSuffix = hours === 1 ? "hour" : "hours"
  const confirmationsSuffix =
    confirmations === 1 ? "confirmation" : "confirmations"

  useEffect(() => {
    const getEstimatedDepositFees = async () => {
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedDepositFees(depositedAmount)
      updateState("mintingFee", optimisticMintFee)
      updateState("thresholdNetworkFee", treasuryFee)
      updateState("tBTCMintAmount", amountToMint)
    }

    getEstimatedDepositFees()
  }, [depositedAmount, updateState, threshold])

  const initiateMintTransaction = async () => {
    if (depositRevealErrorData) {
      setDepositRevealErrorData(undefined)
      console.log("Revealing deposit failed, trying again...")
    }
    await revealDeposit(utxo)
  }

  return (
    <>
      {depositRevealErrorData ? (
        <Toast
          status="error"
          title="Error."
          description={`Code: ${depositRevealErrorData?.code}`}
        >
          <Toast.CollapsibleDetails>
            {depositRevealErrorData?.message}
          </Toast.CollapsibleDetails>
        </Toast>
      ) : null}
      <BridgeProcessCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <VStack spacing={6}>
        <VStack spacing={2}>
          <H5 as="p" color="hsla(0, 0%, 100%, 50%)" fontWeight="normal">
            Deposit received
          </H5>
          <Box
            as="p"
            fontSize="40px"
            lineHeight="48px"
            fontWeight="normal"
            color="hsla(0, 0%, 100%, 50%)"
          >
            <InlineTokenBalance
              fontWeight="black"
              color="white"
              tokenAmount={depositedAmount}
            />
            &nbsp;BTC
          </Box>
        </VStack>
        <HStack
          px={4}
          py={2}
          border="1px solid #333"
          bg="hsla(0, 0%, 0%, 30%)"
          rounded="3xl"
          spacing={4}
        >
          <BodyMd color="hsla(0, 0%, 100%, 50%)">
            <Box as="span" color="hsl(151, 100%, 70%)">
              +{confirmations}
            </Box>
            &nbsp;{confirmationsSuffix}
          </BodyMd>
          <LabeledBadge label="Est." icon={ClockIcon}>
            {hours} {hoursSuffix}
          </LabeledBadge>
        </HStack>
      </VStack>
      <MintingTransactionDetails my={8} withSubTotal withTotal />
      <Button
        onClick={initiateMintTransaction}
        isFullWidth
        data-ph-capture-attribute-button-name={
          "Confirm deposit & mint (Step 2)"
        }
      >
        {depositRevealErrorData ? "Try again" : "Mint"}
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
