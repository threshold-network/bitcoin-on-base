import { FC } from "react"
import {
  HStack,
  Icon,
  Card,
  LabelSm,
  VStack,
  LabelMd,
  LabelLg,
  H2,
  Text,
} from "@threshold-network/components"
import TokenBalance, { TokenBalanceProps } from "../TokenBalance"
// import AddToMetamaskButton from "../AddToMetamaskButton"
import { Contract } from "@ethersproject/contracts"

type Props = {
  icon: any
  title: string | JSX.Element
  tokenBalance: number | string
  contract: Contract | null
} & Pick<
  TokenBalanceProps,
  | "tokenDecimals"
  | "tokenFormat"
  | "usdBalance"
  | "withSymbol"
  | "tokenSymbol"
  | "precision"
  | "withHigherPrecision"
  | "higherPrecision"
>

const TokenBalanceCardTemplate: FC<Props> = ({
  title,
  tokenSymbol,
  tokenBalance,
  usdBalance,
  contract,
  tokenDecimals,
  tokenFormat,
  withHigherPrecision,
  precision,
  higherPrecision,
  withSymbol = false,
  ...restProps
}) => {
  return (
    <VStack spacing={1} alignItems="flex-start" {...restProps}>
      <H2
        fontSize={16}
        lineHeight="24px"
        color="#808080"
        fontWeight="medium"
        textTransform="capitalize"
      >
        {title}
      </H2>
      <HStack alignItems="baseline" fontSize={24} lineHeight="40px">
        <TokenBalance
          tokenAmount={tokenBalance}
          usdBalance={usdBalance}
          tokenDecimals={tokenDecimals}
          tokenFormat={tokenFormat}
          withHigherPrecision={withHigherPrecision}
          precision={precision}
          higherPrecision={higherPrecision}
          isEstimated
          fontWeight="black"
          color="white"
        />
        <Text color="#808080">{tokenSymbol}</Text>
      </HStack>
    </VStack>
  )
}

export default TokenBalanceCardTemplate
