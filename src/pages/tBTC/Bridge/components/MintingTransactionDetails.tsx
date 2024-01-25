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

export type MintingTransactionDetailsProps = ListProps & {
  withTotal?: boolean
  withSubTotal?: boolean
}

const MintingTransactionDetails: FC<MintingTransactionDetailsProps> = ({
  withSubTotal = false,
  withTotal = false,
  ...restProps
}) => {
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
    <List spacing={4} {...restProps}>
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
      {withTotal || withSubTotal ? (
        <ListItem>
          <StackDivider w="full" h="1px" bg="hsla(0, 0%, 100%, 10%)" />
        </ListItem>
      ) : null}
      {withSubTotal ? (
        <TransactionDetailsAmountItem
          label="Total Fees"
          tokenAmount={totalFees.toString()}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
          isSubTotal={withSubTotal}
        />
      ) : null}
      {withTotal ? (
        <TransactionDetailsAmountItem
          label="You will receive"
          tokenAmount={amountToReceive.toString()}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
          isTotal={withTotal}
        />
      ) : null}
    </List>
  )
}

export default MintingTransactionDetails
