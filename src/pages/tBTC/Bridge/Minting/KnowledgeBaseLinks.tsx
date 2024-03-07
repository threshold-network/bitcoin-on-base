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
  DepositTransactionHistory,
  DepositTransactionHistoryItemType,
} from "../components/DepositTransactionHistory"
import bitcoinJuiceIllustration from "../../../../static/images/bitcoin-juice.png"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"
import { useTBTCTokenAddress } from "../../../../hooks/useTBTCTokenAddress"
import { createLinkToBlockExplorerForChain } from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

export type KnowledgeBaseLinksProps = {
  /** NOTE: This value should be captured from URL parameters. */
  depositKey?: string
} & StackProps

export const KnowledgeBaseLinks: FC<KnowledgeBaseLinksProps> = ({
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

  const transactions: DepositTransactionHistoryItemType[] = [
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
  ].filter(({ txHash }) => txHash) as DepositTransactionHistoryItemType[]

  const resources: BridgeProcessResourcesItemProps[] = [
    {
      title: "Token Contract",
      link: createLinkToBlockExplorerForChain["ethereum"](
        useTBTCTokenAddress(),
        ExplorerDataType.ADDRESS
      ),
    },
    {
      title: "Bridge Contract",
      link: createLinkToBlockExplorerForChain["ethereum"](
        useTBTCBridgeContractAddress(),
        ExplorerDataType.ADDRESS
      ),
    },
    {
      title: "Read our documentation",
      description: "Everything you need to know about our contracts.",
      link: ExternalHref.mintersAndGuardiansDocs,
      variant: "expanded",
      imageSrc: bitcoinJuiceIllustration,
    },
  ]

  return (
    <VStack align="stretch" spacing={{ base: 4, lg: 52 }} {...restProps}>
      {depositKey ? <DepositTransactionHistory items={transactions} /> : null}
      <BridgeProcessResources items={resources} />
    </VStack>
  )
}
