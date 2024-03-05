import { StackProps, VStack } from "@chakra-ui/react"
import { FC, useState } from "react"
import { ExternalHref } from "../../../../enums"
import {
  useFetchDepositDetails,
  useSubscribeToOptimisticMintingFinalizedEventBase,
  useSubscribeToOptimisticMintingRequestedEventBase,
} from "../../../../hooks/tbtc"
import {
  BridgeProcessResources,
  BridgeProcessResourcesItemProps,
} from "../components/BridgeProcessResources"
import {
  TransactionHistory,
  TransactionHistoryItemType,
} from "../components/TransactionHistory"
import bitcoinJuiceIllustration from "../../../../static/images/bitcoin-juice.png"

export type KnowledgebaseLinksProps = {
  /** NOTE: This value should be captured from URL parameters. */
  depositKey?: string
} & StackProps

const resources: BridgeProcessResourcesItemProps[] = [
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

export const KnowledgebaseLinks: FC<KnowledgebaseLinksProps> = ({
  depositKey = "",
  ...restProps
}) => {
  const { data } = useFetchDepositDetails(depositKey)
  const [mintingRequestedTxHash, setMintingRequestedTxHash] = useState<string>()
  const [mintingFinalizedTxHash, setMintingFinalizedTxHash] = useState<string>()
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
        setMintingFinalizedTxHash(event.transactionHash)
      }
    },
    undefined,
    true
  )
  const btcDepositTxHash = data?.btcTxHash
  const depositRevealedTxHash = data?.depositRevealedTxHash

  const transactions: TransactionHistoryItemType[] = [
    { label: "Bitcoin Deposit", txHash: btcDepositTxHash, chain: "bitcoin" },
    { label: "Reveal", txHash: depositRevealedTxHash, chain: "ethereum" },
    {
      label: "Minting Initiation",
      txHash: data?.optimisticMintingRequestedTxHash ?? mintingRequestedTxHash,
      chain: "ethereum",
    },
  ].filter(({ txHash }) => txHash) as TransactionHistoryItemType[]

  return (
    <VStack align="stretch" spacing={{ base: 4, lg: 52 }} {...restProps}>
      {depositKey ? <TransactionHistory items={transactions} /> : null}
      <BridgeProcessResources items={resources} />
    </VStack>
  )
}
