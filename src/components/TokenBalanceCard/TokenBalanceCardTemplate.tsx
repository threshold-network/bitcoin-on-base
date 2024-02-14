import { FC } from "react"
import { HStack, VStack, H2, Text } from "@threshold-network/components"
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
  | "higherPrecision"
  | "isLarge"
>

const TokenBalanceCardTemplate: FC<Props> = ({
  title,
  tokenSymbol,
  tokenBalance,
  usdBalance,
  contract,
  tokenDecimals,
  tokenFormat,
  precision,
  higherPrecision,
  withSymbol = false,
  isLarge = false,
  ...restProps
}) => {
  return (
    <VStack spacing={isLarge ? 4 : 1} alignItems="flex-start" {...restProps}>
      <Text
        as="h2"
        fontSize={isLarge ? "lg" : "md"}
        lineHeight={6}
        color="hsl(0, 0%, 50%)"
        fontWeight="medium"
      >
        {title}
      </Text>
      <HStack alignItems="baseline">
        <TokenBalance
          tokenAmount={tokenBalance}
          tokenSymbol={tokenSymbol}
          usdBalance={usdBalance}
          tokenDecimals={tokenDecimals}
          tokenFormat={tokenFormat}
          precision={precision}
          higherPrecision={higherPrecision}
          isEstimated
          isLarge={isLarge}
          fontWeight="black"
          color="hsl(0, 0%, 90%)"
        />
      </HStack>
    </VStack>
  )
}

export default TokenBalanceCardTemplate
