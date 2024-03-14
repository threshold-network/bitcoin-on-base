import { StackProps, VStack } from "@chakra-ui/react"
import { FC, useState } from "react"
import { ExternalHref } from "../../../../enums"
import {
  BridgeProcessResources,
  BridgeProcessResourcesItemProps,
} from "../components/BridgeProcessResources"
import {
  DepositTransactionHistory,
  DepositTransactionHistoryItemType,
} from "../components/DepositTransactionHistory"
import bitcoinJuiceIllustration from "../../../../static/images/bitcoin-juice.png"
import coinShieldIllustration from "../../../../static/images/coin-shield.png"
import confirmationPortalsIllustration from "../../../../static/images/confirmation-portals.png"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"
import { useTBTCTokenAddress } from "../../../../hooks/useTBTCTokenAddress"
import { createLinkToBlockExplorerForChain } from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { DepositDetailsStep } from "../../../../types"

export type KnowledgeBaseLinksProps = {
  /** NOTE: This value should be captured from URL parameters. */
  depositKey?: string
} & StackProps

export const KnowledgeBaseLinks: FC<KnowledgeBaseLinksProps> = ({
  depositKey = "",
  ...restProps
}) => {
  const {
    depositDetails: { data },
    depositDetailsStep,
  } = useTbtcState()
  const btcDepositTxHash = data?.btcTxHash
  const depositRevealedTxHash = data?.depositRevealedTxHash
  const mintingRequestedTxHash =
    data?.optimisticMintingRequestedTxHashFromEvent ??
    data?.optimisticMintingRequestedTxHash
  const mintingFinalizedTxHash =
    data?.optimisticMintingFinalizedTxHashFromEvent ??
    data?.optimisticMintingFinalizedTxHash

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
    depositKey &&
      depositDetailsStep === DepositDetailsStep.BitcoinConfirmations && {
        title: "Bitcoin Confirmations Requirement",
        description:
          "Six confirmations typically ensure transaction validity and finality.",
        link: ExternalHref.btcConfirmations,
        variant: "expanded",
        imageSrc: confirmationPortalsIllustration,
      },
    depositKey &&
      depositDetailsStep === DepositDetailsStep.GuardianCheck && {
        title: "Minters, Guardians and a secure tBTC",
        description:
          "A phased approach with two main roles: Minters and Guardians.",
        link: ExternalHref.mintersAndGuardiansDocs,
        variant: "expanded",
        imageSrc: coinShieldIllustration,
      },
    !depositKey && {
      title: "Read our documentation",
      description: "Everything you need to know about our contracts.",
      link: ExternalHref.thresholdBlog,
      variant: "expanded",
      imageSrc: bitcoinJuiceIllustration,
    },
  ].filter(Boolean) as BridgeProcessResourcesItemProps[]

  return (
    <VStack align="stretch" spacing={{ base: 4, lg: 52 }} {...restProps}>
      {depositKey ? <DepositTransactionHistory items={transactions} /> : null}
      <BridgeProcessResources items={resources} />
    </VStack>
  )
}
