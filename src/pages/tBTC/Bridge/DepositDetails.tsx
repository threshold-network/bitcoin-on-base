import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  BodyLg,
  BodyMd,
  BodySm,
  Box,
  Divider,
  Flex,
  Icon,
  LabelSm,
  List,
  ListItem,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@threshold-network/components"
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { IoTime as TimeIcon } from "react-icons/all"
import { useLocation, useNavigate, useParams } from "react-router"
import ButtonLink from "../../../components/ButtonLink"
import {
  BridgeProcessIndicator,
  TBTCTokenContractLink,
} from "../../../components/tBTC"
import { ExternalPool } from "../../../components/tBTC/ExternalPool"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import { TransactionDetailsAmountItem } from "../../../components/TransactionDetails"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import { CurveFactoryPoolId, ExternalHref } from "../../../enums"
import { useAppDispatch } from "../../../hooks/store"
import { DepositData, useFetchDepositDetails } from "../../../hooks/tbtc"
import { useFetchExternalPoolData } from "../../../hooks/useFetchExternalPoolData"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { tbtcSlice } from "../../../store/tbtc"
import { PageComponent } from "../../../types"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { BridgeProcessDetailsCard } from "./components/BridgeProcessDetailsCard"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import {
  BridgeProcessResource,
  BridgeProcessResourceProps,
} from "./components/BridgeProcessResource"
import { Step1, Step2, Step3, Step4 } from "./components/DepositDetailsStep"

export const DepositDetails: PageComponent = () => {
  const { depositKey } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { txConfirmations, updateState } = useTbtcState()
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)
  const tBTCWBTCSBTCPoolData = useFetchExternalPoolData(
    "curve",
    CurveFactoryPoolId.TBTC_WBTC_SBTC
  )

  const [mintingProgressStep, setMintingProgressStep] =
    useState<DepositDetailsTimelineStep>("bitcoin-confirmations")

  const depositStatusTextColor = useColorModeValue("brand.500", "brand.300")

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
    return () => {
      updateState("depositDetailsStep", "bitcoin-confirmations")
    }
  })

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

  const transactions: {
    label: string
    txHash?: string
    chain: ViewInBlockExplorerChain
  }[] = [
    { label: "Bitcoin Deposit", txHash: btcDepositTxHash, chain: "bitcoin" },
    { label: "Reveal", txHash: depositRevealedTxHash, chain: "ethereum" },
    {
      label: "Minting Initiation",
      txHash: data.optimisticMintingRequestedTxHash,
      chain: "ethereum",
    },
    {
      label: "Minting completion",
      txHash: data.optimisticMintingFinalizedTxHash,
      chain: "ethereum",
    },
  ]

  return (
    <DepositDetailsPageContext.Provider
      value={{
        step: mintingProgressStep,
        updateStep: setMintingProgressStep,
        btcTxHash: btcDepositTxHash,
        optimisticMintingRequestedTxHash,
        optimisticMintingFinalizedTxHash,
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
          <>
            <Stack
              direction={{
                base: "column",
                xl: "row",
              }}
              divider={<StackDivider />}
              spacing={4}
            >
              <Flex flexDirection="column" w={{ base: "100%", xl: "65%" }}>
                <Flex mb="4" alignItems="center" textStyle="bodyLg">
                  <BodyLg>
                    <Box
                      as="span"
                      fontWeight="600"
                      color={depositStatusTextColor}
                    >
                      {mintingProgressStep === "completed"
                        ? "Minted"
                        : "Minting"}
                    </Box>
                    {mintingProgressStep !== "completed" && ` - In progress...`}
                  </BodyLg>{" "}
                  <InlineTokenBalance
                    tokenAmount={amount || "0"}
                    tokenSymbol="tBTC"
                    withSymbol
                    ml="auto"
                  />
                </Flex>
                {mintingProgressStep !== "completed" && (
                  <Alert status="info" my={6}>
                    <AlertIcon />
                    <AlertDescription>
                      It is safe to close this window. Minting will continue as
                      a background process and will not be interrupted.
                    </AlertDescription>
                  </Alert>
                )}
                <StepSwitcher />
              </Flex>
              <Flex
                w={{ base: "100%", xl: "35%" }}
                mb={{ base: "20", xl: "unset" }}
                direction="column"
              >
                <LabelSm mb="8" mt={{ xl: 2 }}>
                  Transaction History
                </LabelSm>
                <Badge
                  size="sm"
                  colorScheme="yellow"
                  variant="solid"
                  display="flex"
                  alignItems="center"
                  alignSelf="flex-start"
                  mb="4"
                >
                  <Icon as={TimeIcon} /> ~3 hours minting time
                </Badge>
                <List color="gray.500" spacing="2" mb="20">
                  {transactions
                    .filter((item) => !!item.txHash)
                    .map((item) => (
                      <ListItem key={item.txHash}>
                        <BodySm>
                          {item.label}{" "}
                          <ViewInBlockExplorer
                            id={item.txHash!}
                            type={ExplorerDataType.TRANSACTION}
                            chain={item.chain}
                            text="transaction"
                          />
                          .
                        </BodySm>
                      </ListItem>
                    ))}
                </List>
                {mintingProgressStep !== "completed" && (
                  <>
                    <BridgeProcessIndicator
                      bridgeProcess="mint"
                      mt="auto"
                      mb="10"
                    />
                    <BridgeProcessResource
                      {...stepToResourceData[mintingProgressStep]}
                    />
                  </>
                )}
              </Flex>
            </Stack>
            {mintingProgressStep !== "completed" && (
              <>
                <Divider />
                <Flex mt="8" alignItems="center">
                  <BodyLg>
                    Eager to start a new mint while waiting for this one? You
                    can now.
                  </BodyLg>
                  <ButtonLink size="lg" to="/tBTC/mint" marginLeft="auto">
                    New Mint
                  </ButtonLink>
                </Flex>
              </>
            )}
          </>
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

const stepToResourceData: Record<
  Exclude<DepositDetailsTimelineStep, "completed">,
  BridgeProcessResourceProps
> = {
  "bitcoin-confirmations": {
    title: "Bitcoin Confirmations Requirement",
    subtitle:
      "Confirmations typically ensure transaction validity and finality.",
    link: ExternalHref.btcConfirmations,
  },
  "minting-initialized": {
    title: "Minters, Guardians and a secure tBTC",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "guardian-check": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "minting-completed": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
}
