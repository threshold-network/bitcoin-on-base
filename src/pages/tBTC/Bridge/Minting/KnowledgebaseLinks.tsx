import { StackProps, VStack } from "@chakra-ui/react"
import { FC } from "react"
import { ExternalHref } from "../../../../enums"
import { useFetchDepositDetails } from "../../../../hooks/tbtc"
import {
  BridgeProcessResources,
  BridgeProcessResourcesItemProps,
} from "../components/BridgeProcessResources"
import {
  TransactionHistory,
  TransactionHistoryItemType,
} from "../components/TransactionHistory"
import bitcoinJuiceIllustration from "../../../../static/images/bitcoin-juice.png"

export type KnowledgebaseLinksProps = { depositKey?: string } & StackProps

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
  const btcDepositTxHash = data?.btcTxHash
  const depositRevealedTxHash = data?.depositRevealedTxHash

  const transactions: TransactionHistoryItemType[] = [
    { label: "Bitcoin Deposit", txHash: btcDepositTxHash, chain: "bitcoin" },
    { label: "Reveal", txHash: depositRevealedTxHash, chain: "ethereum" },
    {
      label: "Minting Initiation",
      txHash:
        data?.optimisticMintingRequestedTxHash /* ?? mintingRequestedTxHash */,
      chain: "ethereum",
    },
    {
      label: "Minting completion",
      txHash:
        data?.optimisticMintingFinalizedTxHash /* ?? mintingFinalizedTxHash */,
      chain: "ethereum",
    },
  ]

  return (
    <VStack align="stretch" spacing={{ base: 4, lg: 52 }} {...restProps}>
      {depositKey ? <TransactionHistory items={transactions} /> : null}
      <BridgeProcessResources items={resources} />
    </VStack>
  )
}
