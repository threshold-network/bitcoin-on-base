import {
  List,
  ListProps,
  ListItem,
  StackDivider,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
import { FC } from "react"
import { TransactionDetailsAmountItem } from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"

const MintingTransactionDetails: FC<ListProps> = (props) => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee } = useTbtcState()

  if (!tBTCMintAmount || !mintingFee || !thresholdNetworkFee) {
    // It's already hidden behind a Skelton component
    return null
  }

  const totalFees = BigNumber.from(mintingFee).add(
    BigNumber.from(thresholdNetworkFee)
  )

  const amountToReceive = BigNumber.from(tBTCMintAmount).sub(totalFees)

  return (
    <List spacing={4} {...props}>
      <TransactionDetailsAmountItem
        label="Bitcoin Deposit Miner Fee"
        tokenAmount={mintingFee}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
      />
      <TransactionDetailsAmountItem
        label="tBTC Bridge Fee"
        tokenAmount={thresholdNetworkFee}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
      />
      <ListItem>
        <StackDivider w="full" h="1px" bg="hsla(0, 0%, 100%, 10%)" />
      </ListItem>
      <TransactionDetailsAmountItem
        label="Total Fees"
        tokenAmount={totalFees.toString()}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
        isSubTotal
      />
      <TransactionDetailsAmountItem
        label="You will receive"
        tokenAmount={amountToReceive.toString()}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
        isTotal
      />
    </List>
  )
}

export default MintingTransactionDetails
