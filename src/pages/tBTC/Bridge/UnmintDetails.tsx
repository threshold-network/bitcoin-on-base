import { FC, useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import {
  BodyLg,
  BodyMd,
  BodySm,
  Divider,
  H5,
  LabelSm,
  List,
  ListItem,
  ONE_MINUTE_IN_SECONDS,
  SkeletonText,
  useColorModeValue,
} from "@threshold-network/components"
import ButtonLink from "../../../components/ButtonLink"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../components/TransactionDetails"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { ExternalHref } from "../../../enums"
import { useAppDispatch } from "../../../hooks/store"
import {
  useFindRedemptionInBitcoinTx,
  useSubscribeToRedemptionsCompletedEventBase,
} from "../../../hooks/tbtc"
import { useFetchRedemptionDetails } from "../../../hooks/tbtc/useFetchRedemptionDetails"
import { tbtcSlice } from "../../../store/tbtc"
import { PageComponent } from "../../../types"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { dateAs, dateToUnixTimestamp } from "../../../utils/date"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import { BridgeProcessDetailsCard } from "./components/BridgeProcessDetailsCard"
import { BridgeProcessDetailsPageSkeleton } from "./components/BridgeProcessDetailsPageSkeleton"
import { BridgeProcessResourcesItem } from "./components/BridgeProcessResources"

export const UnmintDetails: PageComponent = () => {
  const [searchParams] = useSearchParams()
  const walletPublicKeyHash = searchParams.get("walletPublicKeyHash")
  const redeemerOutputScript = searchParams.get("redeemerOutputScript")
  const redeemer = searchParams.get("redeemer")
  const { redemptionRequestedTxHash } = useParams()
  const dispatch = useAppDispatch()
  const threshold = useThreshold()

  const { data, isFetching, error } = useFetchRedemptionDetails(
    redemptionRequestedTxHash,
    walletPublicKeyHash,
    redeemerOutputScript,
    redeemer
  )
  const findRedemptionInBitcoinTx = useFindRedemptionInBitcoinTx()
  const [redemptionFromBitcoinTx, setRedemptionFromBitcoinTx] = useState<
    Awaited<ReturnType<typeof findRedemptionInBitcoinTx>> | undefined
  >(undefined)

  useSubscribeToRedemptionsCompletedEventBase(
    async (eventWalletPublicKeyHash, redemptionTxHash, event) => {
      if (eventWalletPublicKeyHash !== walletPublicKeyHash) return

      const redemption = await findRedemptionInBitcoinTx(
        redemptionTxHash,
        event.blockNumber,
        redeemerOutputScript!
      )
      if (!redemption) return

      setRedemptionFromBitcoinTx(redemption)

      if (redemptionRequestedTxHash && redeemerOutputScript) {
        dispatch(
          tbtcSlice.actions.redemptionCompleted({
            redemptionKey: threshold.tbtc.buildRedemptionKey(
              walletPublicKeyHash,
              redeemerOutputScript
            ),
            redemptionRequestedTxHash,
          })
        )
      }
    },
    [],
    true
  )

  const [shouldDisplaySuccessStep, setShouldDisplaySuccessStep] =
    useState(false)

  const _isFetching = (isFetching || !data) && !error
  const wasDataFetched = !isFetching && !!data && !error

  const isProcessCompleted = !!redemptionFromBitcoinTx?.bitcoinTxHash
  const shouldForceIsProcessCompleted =
    !!data?.redemptionCompletedTxHash?.bitcoin

  const requestedAmount = data?.requestedAmount ?? "0"
  const receivedAmount =
    data?.receivedAmount ?? redemptionFromBitcoinTx?.receivedAmount ?? "0"
  const btcTxHash =
    data?.redemptionCompletedTxHash?.bitcoin ??
    redemptionFromBitcoinTx?.bitcoinTxHash

  const thresholdNetworkFee = data?.treasuryFee ?? "0"
  const btcAddress = data?.btcAddress ?? redemptionFromBitcoinTx?.btcAddress
  const redemptionCompletedAt =
    data?.completedAt ?? redemptionFromBitcoinTx?.redemptionCompletedTimestamp
  const redemptionRequestedAt = data?.requestedAt
  const [redemptionTime, setRedemptionTime] = useState<
    ReturnType<typeof dateAs>
  >({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    if (!redemptionCompletedAt && redemptionRequestedAt) {
      intervalId = setInterval(() => {
        setRedemptionTime(
          dateAs(
            redemptionCompletedAt ??
              dateToUnixTimestamp() - (data?.requestedAt ?? 0)
          )
        )
      }, ONE_MINUTE_IN_SECONDS)
    } else if (redemptionCompletedAt && redemptionRequestedAt) {
      setRedemptionTime(dateAs(redemptionCompletedAt - redemptionRequestedAt))
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [redemptionCompletedAt, redemptionRequestedAt])

  const transactions: {
    label: string
    txHash?: string
    chain: ViewInBlockExplorerChain
  }[] = [
    {
      label: "Unwrap",
      txHash: data?.redemptionRequestedTxHash,
      chain: "ethereum",
    },
    {
      label: "BTC sent",
      txHash: btcTxHash,
      chain: "bitcoin",
    },
  ]

  const timelineBadgeBgColor = useColorModeValue("white", "brand.800")

  return (
    <BridgeLayout
      as={BridgeProcessDetailsCard}
      spacing="4"
      // @ts-ignore
      isProcessCompleted={
        shouldDisplaySuccessStep || shouldForceIsProcessCompleted
      }
    >
      <BridgeLayoutMainSection>
        {_isFetching && <BridgeProcessDetailsPageSkeleton />}
        {error && <>{error}</>}
        {wasDataFetched && (
          <>
            {shouldDisplaySuccessStep || shouldForceIsProcessCompleted ? (
              <SuccessStep
                requestedAmount={requestedAmount}
                receivedAmount={receivedAmount}
                thresholdNetworkFee={thresholdNetworkFee}
                btcAddress={btcAddress!}
              />
            ) : null}
          </>
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection
        alignSelf="stretch"
        display="flex"
        flex="1"
        flexDirection="column"
      >
        {_isFetching ? (
          <AsideSectionSkeleton />
        ) : (
          <>
            <LabelSm>
              {isProcessCompleted ? "total time" : "elapsed time"}
            </LabelSm>
            <BodyLg mt="2.5" color="gray.500">
              {`${redemptionTime.days}d ${redemptionTime.hours}h ${redemptionTime.minutes}m`}
            </BodyLg>

            <LabelSm mt="5">Transaction History</LabelSm>
            <List mt="6" color="gray.500" spacing="2" mb="20">
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
            {!(shouldDisplaySuccessStep || shouldForceIsProcessCompleted) && (
              <BridgeProcessResourcesItem
                title="Minters and Guardians in Optimistic Minting"
                description="A phased approach with two main roles: Minters and Guardians."
                link={ExternalHref.mintersAndGuardiansDocs}
                variant="expanded"
              />
            )}
          </>
        )}
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

const SuccessStep: FC<{
  requestedAmount: string
  receivedAmount: string
  thresholdNetworkFee: string
  btcAddress: string
}> = ({ requestedAmount, receivedAmount, thresholdNetworkFee, btcAddress }) => {
  return (
    <>
      <H5 mt="4">Success!</H5>
      <Divider mt="9" mb="4" />
      <List spacing="4">
        <TransactionDetailsAmountItem
          label="Unminted Amount"
          tokenAmount={requestedAmount}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsAmountItem
          label="Received Amount"
          tokenAmount={receivedAmount}
          tokenSymbol="BTC"
          tokenDecimals={8}
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
        <TransactionDetailsItem label="BTC address">
          <CopyAddressToClipboard
            address={btcAddress}
            chain="bitcoin"
            fontSize="14px"
          />
        </TransactionDetailsItem>
      </List>
      <ButtonLink mt="8" size="lg" to="/tBTC/mint" width="100%">
        New Mint
      </ButtonLink>
    </>
  )
}

const AsideSectionSkeleton: FC = () => {
  return (
    <>
      <SkeletonText noOfLines={1} />
      <SkeletonText noOfLines={1} skeletonHeight={6} mt="4" />

      <SkeletonText noOfLines={1} mt="4" />
      <SkeletonText noOfLines={2} mt="4" />
    </>
  )
}

UnmintDetails.route = {
  path: "redemption/:redemptionRequestedTxHash",
  index: false,
  isPageEnabled: true,
}
