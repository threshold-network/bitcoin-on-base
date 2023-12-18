import {
  BodyMd,
  Box,
  HStack,
  Link,
  List,
  ListItem,
} from "@threshold-network/components"
import { FC } from "react"
import { FaChevronRight as ChevronIcon } from "react-icons/fa"
import {
  Chain,
  createLinkToBlockExplorerForChain,
} from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

export type TransactionHistoryItemType = {
  label: string
  txHash?: string
  chain: Chain
}

interface Props {
  /**
   * Items to display in the transaction history list as block explorer links.
   */
  items: TransactionHistoryItemType[]
}

/**
 * Displays a list of transactions as block explorer links.
 * @return {ReactNode}
 */
export const TransactionHistory: FC<Props> = ({ items, ...restProps }) => (
  <Box {...restProps}>
    <BodyMd fontWeight="medium" mb="4">
      Transaction History
    </BodyMd>
    <List spacing="4">
      {items
        .filter((item) => !!item.txHash)
        .map(({ txHash, label, chain = "ethereum" }) => {
          const link = createLinkToBlockExplorerForChain[chain](
            txHash!,
            ExplorerDataType.TRANSACTION
          )
          return (
            <ListItem key={txHash}>
              <HStack as={Link} spacing="2.5" isExternal href={link}>
                <ChevronIcon color="#66F9FF" size={16} />
                <BodyMd>{label}.</BodyMd>
              </HStack>
            </ListItem>
          )
        })}
    </List>
  </Box>
)
