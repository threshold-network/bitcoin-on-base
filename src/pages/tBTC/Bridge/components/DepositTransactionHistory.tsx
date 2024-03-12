import {
  BodyMd,
  Box,
  HStack,
  List,
  ListItem,
  Skeleton,
  SkeletonText,
} from "@threshold-network/components"
import { FC } from "react"
import Link from "../../../../components/Link"
import {
  Chain,
  createLinkToBlockExplorerForChain,
} from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

export type DepositTransactionHistoryItemType = {
  label: string
  txHash?: string
  chain: Chain
}

interface Props {
  /**
   * Items to display in the transaction history list as block explorer links.
   */
  items: DepositTransactionHistoryItemType[]
}

/**
 * Displays a list of transactions as block explorer links.
 * @return {ReactNode}
 */
export const DepositTransactionHistory: FC<Props> = ({
  items,
  ...restProps
}) => {
  if (items.length === 0) {
    return (
      <Box>
        <Skeleton mb={8} w="80%" h={4} />
        <SkeletonText noOfLines={3} spacing={4} skeletonHeight={4} />
      </Box>
    )
  }

  return (
    <Box {...restProps}>
      <BodyMd color="hsl(0, 0%, 50%)" fontWeight="medium" mb="6">
        Transaction history
      </BodyMd>
      <List spacing="2">
        {items.map(({ txHash, label, chain = "ethereum" }) => {
          const link = createLinkToBlockExplorerForChain[chain](
            txHash!,
            ExplorerDataType.TRANSACTION
          )
          return (
            <ListItem key={txHash}>
              <BodyMd color="white" w="fit-content" position="relative">
                {label}{" "}
                <Link
                  color="brand.100"
                  textDecoration="none"
                  _before={{
                    content: '""',
                    position: "absolute",
                    w: "full",
                    h: "full",
                    inset: 0,
                  }}
                  isExternal
                  href={link}
                >
                  Transaction
                </Link>
              </BodyMd>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
