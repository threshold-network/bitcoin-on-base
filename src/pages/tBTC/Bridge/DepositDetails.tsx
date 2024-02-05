import {
  BodyLg,
  BodyMd,
  Divider,
  HStack,
  List,
  Box,
  VStack,
} from "@threshold-network/components"
import { FC, useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import ButtonLink from "../../../components/ButtonLink"
import { TBTCTokenContractLink } from "../../../components/tBTC"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import { TransactionDetailsAmountItem } from "../../../components/TransactionDetails"
import { useAppDispatch } from "../../../hooks/store"
import {
  DepositData,
  useFetchDepositDetails,
  useSubscribeToOptimisticMintingFinalizedEventBase,
  useSubscribeToOptimisticMintingRequestedEventBase,
} from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { tbtcSlice } from "../../../store/tbtc"
import { PageComponent } from "../../../types"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import { Step1, Step2, Step3, Step4 } from "./components/DepositDetailsStep"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)

  const [mintingProgressStep, setMintingProgressStep] =
    useState<DepositDetailsTimelineStep>("bitcoin-confirmations")
  useSubscribeToOptimisticMintingEvents(depositKey)

  // Cache the location state in component state.
  const [locationStateCache] = useState<{ shouldStartFromFirstStep?: boolean }>(
    (state as { shouldStartFromFirstStep?: boolean }) || {}
  )

  useEffect(() => {
    // Redirect to current path and clear the location state.
    navigate(".", { replace: true })
  }, [navigate])

  const shouldStartFromFirstStep = locationStateCache?.shouldStartFromFirstStep

  // Extract deposit details values to use them as a dependency in hook
  // dependency array.
  const btcDepositTxHash = data?.btcTxHash
  const amount = data?.amount ?? "0"
  const confirmations = data?.confirmations
  const requiredConfirmations = data?.requiredConfirmations
  const optimisticMintingRequestedTxHash =
    data?.optimisticMintingRequestedTxHash
  const optimisticMintingFinalizedTxHash =
    data?.optimisticMintingFinalizedTxHash
  const thresholdNetworkFee = data?.treasuryFee
  const mintingFee = data?.optimisticMintFee

  useEffect(() => {
    if (
      !!btcDepositTxHash &&
      confirmations !== undefined &&
      requiredConfirmations !== undefined &&
      confirmations < requiredConfirmations
    ) {
      dispatch(
        tbtcSlice.actions.fetchUtxoConfirmations({
          utxo: { transactionHash: btcDepositTxHash, value: amount },
        })
      )
    }
  }, [dispatch, btcDepositTxHash, amount, confirmations, requiredConfirmations])

  useEffect(() => {
    if (!confirmations || !requiredConfirmations || shouldStartFromFirstStep)
      return

    setMintingProgressStep(
      getMintingProgressStep({
        confirmations,
        requiredConfirmations,
        optimisticMintingFinalizedTxHash,
        optimisticMintingRequestedTxHash,
      })
    )
  }, [
    confirmations,
    requiredConfirmations,
    optimisticMintingFinalizedTxHash,
    optimisticMintingRequestedTxHash,
    shouldStartFromFirstStep,
  ])

  return (
    <>
      {(isFetching || !data) && !error && <BridgeProcessDetailsPageSkeleton />}
      {error && <>{error}</>}
      {!isFetching && !!data && !error && (
        <VStack spacing={0}>
          <VStack align="flex-start" alignSelf="stretch" spacing={2} zIndex={1}>
            <BodyMd color="hsla(0, 0%, 100%, 50%)" fontWeight="medium">
              Amount
            </BodyMd>
            <HStack align="baseline" spacing={2}>
              <InlineTokenBalance
                tokenAmount={amount || "0"}
                fontWeight="black"
                fontSize="40px"
                lineHeight={1}
              />
              <BodyLg color="hsla(0, 0%, 100%, 50%)">tBTC</BodyLg>
            </HStack>
          </VStack>
          <StepSwitcher
            step={mintingProgressStep}
            confirmations={confirmations}
            requiredConfirmations={requiredConfirmations}
            btcTxHash={btcDepositTxHash}
            updateStep={setMintingProgressStep}
            amount={amount}
            thresholdNetworkFee={thresholdNetworkFee}
            mintingFee={mintingFee}
          />
        </VStack>
      )}
    </>
  )
}

DepositDetails.route = {
  path: "deposit/:depositKey",
  index: false,
  isPageEnabled: true,
}

type DepositDetailsTimelineStep =
  | "bitcoin-confirmations"
  | "minting-initialized"
  | "guardian-check"
  | "minting-completed"
  | "completed"

const getMintingProgressStep = (
  depositDetails?: Omit<
    DepositData,
    | "depositRevealedTxHash"
    | "btcTxHash"
    | "amount"
    | "optimisticMintFee"
    | "treasuryFee"
  >
): DepositDetailsTimelineStep => {
  if (!depositDetails) return "bitcoin-confirmations"

  const {
    confirmations,
    requiredConfirmations,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
  } = depositDetails

  if (optimisticMintingFinalizedTxHash) return "completed"

  if (optimisticMintingRequestedTxHash) return "guardian-check"

  if (confirmations >= requiredConfirmations) return "minting-initialized"

  return "bitcoin-confirmations"
}

const stepToNextStep: Record<
  Exclude<DepositDetailsTimelineStep, "completed">,
  DepositDetailsTimelineStep
> = {
  "bitcoin-confirmations": "minting-initialized",
  "minting-initialized": "guardian-check",
  "guardian-check": "minting-completed",
  "minting-completed": "completed",
}

type StepSwitcherProps = Pick<
  DepositData,
  "optimisticMintingRequestedTxHash" | "optimisticMintingFinalizedTxHash"
> & {
  step: DepositDetailsTimelineStep
  confirmations?: number
  requiredConfirmations?: number
  btcTxHash?: string
  updateStep: (step: DepositDetailsTimelineStep) => void
  amount?: string
  thresholdNetworkFee?: string
  mintingFee?: string
}

const StepSwitcher: FC<StepSwitcherProps> = ({
  step,
  confirmations,
  requiredConfirmations,
  optimisticMintingRequestedTxHash,
  optimisticMintingFinalizedTxHash,
  btcTxHash,
  updateStep,
  amount,
  thresholdNetworkFee,
  mintingFee,
}) => {
  const onComplete = useCallback(() => {
    if (step === "completed") return

    updateStep(stepToNextStep[step])
  }, [step])

  switch (step) {
    default:
    case "bitcoin-confirmations":
      return (
        <Step1
          txHash={btcTxHash}
          confirmations={confirmations}
          requiredConfirmations={requiredConfirmations}
          onComplete={onComplete}
        />
      )
    case "minting-initialized":
      return (
        <Step2
          txHash={optimisticMintingRequestedTxHash}
          onComplete={onComplete}
        />
      )
    case "guardian-check":
      return (
        <Step3
          txHash={optimisticMintingFinalizedTxHash}
          onComplete={onComplete}
        />
      )
    case "minting-completed":
      return (
        <Step4
          txHash={optimisticMintingFinalizedTxHash}
          onComplete={onComplete}
        />
      )
    case "completed":
      return (
        <Box m={{ base: -6, lg: -10 }}>
          <BodyLg mt="4" fontSize="20px" lineHeight="24px">
            Success!
          </BodyLg>
          <BodyMd mt="2">
            Add the tBTC <TBTCTokenContractLink /> to your Ethereum wallet.
          </BodyMd>
          <Divider my="4" />
          <List spacing="2">
            <TransactionDetailsAmountItem
              label="Minted Amount"
              tokenAmount={amount}
              tokenSymbol="tBTC"
            />
            <TransactionDetailsAmountItem
              label="Minting Fee"
              tokenAmount={mintingFee}
              tokenSymbol="tBTC"
              precision={6}
              higherPrecision={8}
            />
            <TransactionDetailsAmountItem
              label="Threshold Network Fee"
              tokenAmount={thresholdNetworkFee}
              tokenSymbol="tBTC"
              precision={6}
              higherPrecision={8}
            />
          </List>
          <ButtonLink size="lg" mt="8" mb="8" to="/tBTC" isFullWidth>
            New mint
          </ButtonLink>
        </Box>
      )
  }
}

const useSubscribeToOptimisticMintingEvents = (depositKey?: string) => {
  const { updateState } = useTbtcState()

  useSubscribeToOptimisticMintingRequestedEventBase(
    (
      minter,
      depositKeyEventParam,
      depositor,
      amount,
      fundingTxHash,
      fundingOutputIndex,
      event
    ) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        updateState("mintingRequestedTxHash", event.transactionHash)
      }
    },
    undefined,
    true
  )

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (minter, depositKeyEventParam, depositor, optimisticMintingDebt, event) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        updateState("mintingFinalizedTxHash", event.transactionHash)
      }
    },
    undefined,
    true
  )
}
