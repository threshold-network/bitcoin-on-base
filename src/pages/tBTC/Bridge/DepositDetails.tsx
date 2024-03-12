import {
  BodyLg,
  BodyMd,
  Box,
  Divider,
  HStack,
  List,
  VStack,
} from "@threshold-network/components"
import { FC, useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import ButtonLink from "../../../components/ButtonLink"
import { TBTCTokenContractLink } from "../../../components/tBTC"
import { Toast } from "../../../components/Toast"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import { TransactionDetailsAmountItem } from "../../../components/TransactionDetails"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import { useAppDispatch } from "../../../hooks/store"
import { DepositData, useFetchDepositDetails } from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { tbtcSlice } from "../../../store/tbtc"
import { PageComponent } from "../../../types"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import {
  DepositDetailsStep1,
  DepositDetailsStep2,
  DepositDetailsStep3,
  DepositDetailsStep4,
} from "./components/DepositDetailsStep"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { updateState, depositDetailsStep } = useTbtcState()
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)
  const [isSafelyCloseInfoToastVisible, setIsSafelyCloseInfoToastVisible] =
    useState(depositDetailsStep !== "bitcoin-confirmations")

  const [mintingProgressStep, setMintingProgressStep] =
    useState<DepositDetailsTimelineStep>("bitcoin-confirmations")

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
  const {
    btcTxHash: btcDepositTxHash,
    amount,
    confirmations,
    requiredConfirmations,
    depositRevealedTxHash,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
    treasuryFee: thresholdNetworkFee,
    optimisticMintFee: mintingFee,
  } = data

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

    return () => {
      updateState("depositDetailsStep", "bitcoin-confirmations")
    }
  }, [dispatch, btcDepositTxHash, amount, confirmations, requiredConfirmations])

  useEffect(() => {
    if (!confirmations || !requiredConfirmations || shouldStartFromFirstStep)
      return

    const step = getMintingProgressStep({
      confirmations,
      requiredConfirmations,
      optimisticMintingFinalizedTxHash,
      optimisticMintingRequestedTxHash,
    })

    setMintingProgressStep(step)
    updateState("depositDetailsStep", step)
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
        <>
          {depositDetailsStep === "bitcoin-confirmations" && (
            <Toast
              status="success"
              title="Minting successfully started"
              duration={4000}
              onUnmount={() => setIsSafelyCloseInfoToastVisible(true)}
            />
          )}
          {isSafelyCloseInfoToastVisible && (
            <Toast
              status="info"
              title="You can safely close this window."
              description="The minting process will keep running in the background and won't be interrupted."
              orientation="vertical"
              position="right"
            />
          )}
          <VStack spacing={0}>
            <VStack
              align="flex-start"
              alignSelf="stretch"
              spacing={2}
              zIndex={1}
            >
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
        </>
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

type StepSwitcherProps = {
  optimisticMintingRequestedTxHash?: string
  optimisticMintingFinalizedTxHash?: string
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
        <DepositDetailsStep1
          txHash={btcTxHash}
          confirmations={confirmations}
          requiredConfirmations={requiredConfirmations}
          onComplete={onComplete}
        />
      )
    case "minting-initialized":
      return (
        <DepositDetailsStep2
          txHash={optimisticMintingRequestedTxHash}
          onComplete={onComplete}
        />
      )
    case "guardian-check":
      return (
        <DepositDetailsStep3
          txHash={optimisticMintingFinalizedTxHash}
          onComplete={onComplete}
        />
      )
    case "minting-completed":
      return (
        <DepositDetailsStep4
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
