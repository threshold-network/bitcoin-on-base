import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import {
  Badge,
  BodyMd,
  Box,
  Button,
  Flex,
  H5,
  HStack,
  Icon,
  VStack,
} from "@threshold-network/components"
import { FC, useEffect } from "react"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import InfoBox from "../../../../components/InfoBox"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import MintingTransactionDetails from "../components/MintingTransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BigNumber } from "ethers"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useRevealDepositTransaction } from "../../../../hooks/tbtc"
import { useModal } from "../../../../hooks/useModal"
import { getDurationByNumberOfConfirmations } from "../../../../utils/tBTC"
import { FaClock as ClockIcon } from "react-icons/fa"
const InitiateMintingComponent: FC<{
  utxo: BitcoinUtxo
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { tBTCMintAmount, updateState } = useTbtcState()
  const threshold = useThreshold()
  const { closeModal } = useModal()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    // We don't have success modal for deposit reveal so we just closing the
    // current TransactionIsPending modal.
    closeModal()
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
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
    await revealDeposit(utxo)
  }

  return (
    <>
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
          px={3}
          py={2}
          border="1px solid #333"
          bg="hsla(0, 0%, 0%, 30%)"
          rounded="3xl"
          spacing={4}
        >
          <BodyMd color="hsla(0, 0%, 100%, 50%)">
            <Box as="span" color="hsl(151, 100%, 70%)">
              + {confirmations}
            </Box>
            &nbsp;{confirmationsSuffix}
          </BodyMd>
          <Flex as={Badge} align="center" color="hsl(26, 96%, 65%)">
            <Icon as={ClockIcon} mr={2} color="hsl(0, 0%, 53%)" />
            Est. {hours} {hoursSuffix}
          </Flex>
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
        Mint
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
