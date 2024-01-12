import { TimeIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  BodyLg,
  BodyMd,
  BodySm,
  BodyXs,
  Divider,
  Flex,
  HStack,
  Icon,
  LabelSm,
  List,
  ListItem,
  Stack,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@threshold-network/components"
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { IoCheckmarkSharp } from "react-icons/all"
import { useLocation, useNavigate, useParams } from "react-router"
import ButtonLink from "../../../components/ButtonLink"
import {
  BridgeProcessIndicator,
  TBTCTokenContractLink,
} from "../../../components/tBTC"
import { ExternalPool } from "../../../components/tBTC/ExternalPool"
import {
  Timeline,
  TimelineBreakpoint,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineItemStatus,
} from "../../../components/Timeline"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import { TransactionDetailsAmountItem } from "../../../components/TransactionDetails"
import ViewInBlockExplorer, {
  Chain,
} from "../../../components/ViewInBlockExplorer"
import { CurveFactoryPoolId, ExternalHref } from "../../../enums"
import { useAppDispatch } from "../../../hooks/store"
import {
  DepositData,
  useFetchDepositDetails,
  useSubscribeToOptimisticMintingFinalizedEventBase,
  useSubscribeToOptimisticMintingRequestedEventBase,
} from "../../../hooks/tbtc"
import { useFetchExternalPoolData } from "../../../hooks/useFetchExternalPoolData"
import { useTbtcState } from "../../../hooks/useTbtcState"
import bitcoinJuiceIllustration from "../../../static/images/bitcoin-juice.png"
import { tbtcSlice } from "../../../store/tbtc"
import { PageComponent } from "../../../types"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import { BridgeProcessDetailsCard } from "./components/BridgeProcessDetailsCard"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import {
  TransactionHistory,
  TransactionHistoryItemType,
} from "./components/TransactionHistory"
import {
  BridgeProcessResources,
  BridgeProcessResourcesItemProps,
} from "./components/BridgeProcessResources"
import { Step1, Step2, Step3, Step4 } from "./components/DepositDetailsStep"
import { BridgeProcessCircularLoader } from "./components/BridgeProcessCircularLoader"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { txConfirmations } = useTbtcState()
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)
  const tBTCWBTCSBTCPoolData = useFetchExternalPoolData(
    "curve",
    CurveFactoryPoolId.TBTC_WBTC_SBTC
  )

  const [mintingProgressStep, setMintingProgressStep] =
    useState<DepositDetailsTimelineStep>("bitcoin-confirmations")
  const { mintingRequestedTxHash, mintingFinalizedTxHash } =
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
  const depositRevealedTxHash = data?.depositRevealedTxHash
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

  const transactions: TransactionHistoryItemType[] = [
    { label: "Bitcoin Deposit", txHash: btcDepositTxHash, chain: "bitcoin" },
    { label: "Reveal", txHash: depositRevealedTxHash, chain: "ethereum" },
    {
      label: "Minting Initiation",
      txHash: data?.optimisticMintingRequestedTxHash ?? mintingRequestedTxHash,
      chain: "ethereum",
    },
    {
      label: "Minting completion",
      txHash: data?.optimisticMintingFinalizedTxHash ?? mintingFinalizedTxHash,
      chain: "ethereum",
    },
  ]

  return (
    <DepositDetailsPageContext.Provider
      value={{
        step: mintingProgressStep,
        updateStep: setMintingProgressStep,
        btcTxHash: btcDepositTxHash,
        optimisticMintingRequestedTxHash:
          optimisticMintingRequestedTxHash ?? mintingRequestedTxHash,
        optimisticMintingFinalizedTxHash:
          optimisticMintingFinalizedTxHash ?? mintingFinalizedTxHash,
        confirmations: confirmations || txConfirmations,
        requiredConfirmations: requiredConfirmations!,
        amount: amount,
        thresholdNetworkFee,
        mintingFee,
      }}
    >
      <BridgeProcessDetailsCard
        isProcessCompleted={mintingProgressStep === "completed"}
      >
        {(isFetching || !data) && !error && (
          <BridgeProcessDetailsPageSkeleton />
        )}
        {error && <>{error}</>}
        {!isFetching && !!data && !error && (
          <Stack
            direction={{
              base: "column",
              xl: "row",
            }}
            divider={<StackDivider />}
            spacing={4}
          >
            <VStack spacing={0} align="center" w={{ base: "100%", xl: "65%" }}>
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
              <StepSwitcher />
            </VStack>
            <Flex
              w={{ base: "100%", xl: "35%" }}
              mb={{ base: "20", xl: "unset" }}
              direction="column"
            >
              <TransactionHistory items={transactions} />
              {mintingProgressStep !== "completed" && (
                <BridgeProcessResources items={resourceData} />
              )}
            </Flex>
          </Stack>
        )}
      </BridgeProcessDetailsCard>
      {mintingProgressStep === "completed" && (
        <ExternalPool
          title={"tBTC Curve Pool"}
          externalPoolData={{ ...tBTCWBTCSBTCPoolData }}
          mt={4}
        />
      )}
    </DepositDetailsPageContext.Provider>
  )
}

DepositDetails.route = {
  path: "deposit/:depositKey",
  index: false,
  isPageEnabled: true,
}

const DepositDetailsPageContext = createContext<
  | (Pick<
      DepositData,
      "optimisticMintingRequestedTxHash" | "optimisticMintingFinalizedTxHash"
    > & {
      btcTxHash?: string
      confirmations?: number
      requiredConfirmations?: number
      updateStep: (step: DepositDetailsTimelineStep) => void
      step: DepositDetailsTimelineStep
      amount?: string
      mintingFee?: string
      thresholdNetworkFee?: string
    })
  | undefined
>(undefined)

const useDepositDetailsPageContext = () => {
  const context = useContext(DepositDetailsPageContext)

  if (!context) {
    throw new Error(
      "DepositDetailsPageContext used outside of the DepositDetailsPage component."
    )
  }
  return context
}

type DepositDetailsTimelineStep =
  | "bitcoin-confirmations"
  | "minting-initialized"
  | "guardian-check"
  | "minting-completed"
  | "completed"

type DepositDetailsTimelineItem = {
  id: DepositDetailsTimelineStep
  text: string
  status: TimelineItemStatus
}

const depositTimelineItems: DepositDetailsTimelineItem[] = [
  {
    id: "bitcoin-confirmations",
    text: `Bitcoin\nCheckpoint`,
    status: "semi-active",
  },
  {
    id: "minting-initialized",
    text: "Minting\nInitialized",
    status: "inactive",
  },
  {
    id: "guardian-check",
    text: "Guardian\nCheck",
    status: "inactive",
  },
  {
    id: "minting-completed",
    text: "Minting\nCompleted",
    status: "inactive",
  },
]
type DepositDetailsTimelineProps = {
  inProgressStep: DepositDetailsTimelineStep
}

const DepositDetailsTimeline: FC<DepositDetailsTimelineProps> = ({
  inProgressStep,
}) => {
  const items = useMemo<DepositDetailsTimelineItem[]>(() => {
    const isCompleted = inProgressStep === "completed"
    const inProgressItemIndex = depositTimelineItems.findIndex(
      (item) => item.id === inProgressStep
    )
    return depositTimelineItems.map((item, index) => {
      let status: TimelineItemStatus = "active"
      if (isCompleted) return { ...item, status }
      if (index === inProgressItemIndex) {
        status = "semi-active"
      } else if (index > inProgressItemIndex) {
        status = "inactive"
      }

      return { ...item, status }
    })
  }, [inProgressStep])

  return (
    <Timeline>
      {items.map((item) => (
        <TimelineItem key={item.id} status={item.status}>
          <TimelineBreakpoint>
            <TimelineDot position="relative">
              {item.status === "active" && (
                <Icon
                  as={IoCheckmarkSharp}
                  position="absolute"
                  color="white"
                  w="22px"
                  h="22px"
                  m="auto"
                  left="0"
                  right="0"
                  textAlign="center"
                />
              )}
            </TimelineDot>
            <TimelineConnector />
          </TimelineBreakpoint>
          <TimelineContent>
            <BodyXs whiteSpace="pre-line">{item.text}</BodyXs>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

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

const StepSwitcher: FC = () => {
  const {
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
  } = useDepositDetailsPageContext()

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
        <>
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
        </>
      )
  }
}

const useSubscribeToOptimisticMintingEvents = (depositKey?: string) => {
  const [mintingRequestedTxHash, setMintingRequestedTxHash] = useState("")
  const [mintingFinalizedTxHash, setMintingFinalizedTxHashTxHash] = useState("")

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
        setMintingRequestedTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (minter, depositKeyEventParam, depositor, optimisticMintingDebt, event) => {
      const depositKeyFromEvent = depositKeyEventParam.toHexString()
      if (depositKeyFromEvent === depositKey) {
        setMintingFinalizedTxHashTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )

  return { mintingRequestedTxHash, mintingFinalizedTxHash }
}

// TODO: update links

const resourceData: BridgeProcessResourcesItemProps[] = [
  {
    title: "Token Contract",
    link: ExternalHref.btcConfirmations,
  },
  {
    title: "Bridge Contract",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  {
    title: "Read out documentation",
    description: "Everything you need to know about our contracts.",
    link: ExternalHref.mintersAndGuardiansDocs,
    variant: "expanded",
    imageSrc: bitcoinJuiceIllustration,
  },
]
