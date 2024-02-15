import { FC, useMemo } from "react"
import {
  BodySm,
  Box,
  HStack,
  TextProps,
  Text,
  Tooltip,
  BoxProps,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { formatTokenAmount } from "../utils/formatAmount"

export interface TokenBalanceProps {
  tokenAmount: string | number
  usdBalance?: string
  tokenSymbol?: string
  withUSDBalance?: boolean
  withSymbol?: boolean
  tokenDecimals?: number
  isLarge?: boolean
  tokenFormat?: string
  precision?: number
  higherPrecision?: number
  displayTildeBelow?: number
  isEstimated?: boolean
}

export const InlineTokenBalance: FC<TokenBalanceProps & BoxProps> = ({
  withSymbol,
  tokenDecimals,
  tokenFormat,
  tokenAmount,
  tokenSymbol,
  precision = 2,
  higherPrecision = 6,
  displayTildeBelow = 1,
  isEstimated = false,
  ...restProps
}) => {
  const _tokenAmount = useMemo(() => {
    return formatTokenAmount(
      tokenAmount || 0,
      tokenFormat,
      tokenDecimals,
      precision,
      isEstimated ? 0 : displayTildeBelow
    )
  }, [tokenAmount, tokenFormat, tokenDecimals, precision])

  const _tokenAmountWithHigherPrecision = useMemo(() => {
    return formatTokenAmount(
      tokenAmount || 0,
      tokenFormat,
      tokenDecimals,
      higherPrecision,
      isEstimated ? 0 : 1
    )
  }, [tokenAmount, tokenFormat, tokenDecimals, higherPrecision])

  return (
    <Tooltip
      label={`${isEstimated ? "~" : ""}${_tokenAmountWithHigherPrecision}`}
      placement="top"
    >
      <Box as="span" {...restProps}>{`${isEstimated ? "~" : ""}${_tokenAmount}${
        withSymbol ? ` ${tokenSymbol}` : ""
      }`}</Box>
    </Tooltip>
  )
}

const TokenBalance: FC<TokenBalanceProps & TextProps> = ({
  tokenAmount,
  usdBalance,
  tokenSymbol,
  tokenDecimals,
  isLarge,
  tokenFormat,
  precision,
  higherPrecision,
  children,
  ...restProps
}) => {
  const { active } = useWeb3React()
  const shouldRenderTokenAmount = active

  const _tokenAmount = useMemo(() => {
    return formatTokenAmount(
      tokenAmount || 0,
      tokenFormat,
      tokenDecimals,
      precision
    )
  }, [tokenAmount, tokenFormat, tokenDecimals, precision])

  // TODO: more flexible approach to style wrapper, token balance and USD balance.
  return (
    <Box>
      <HStack alignItems="center">
        <Text
          fontSize={isLarge ? "4.5xl" : "2xl"}
          lineHeight={isLarge ? 12 : "lg"}
          {...restProps}
        >
          {shouldRenderTokenAmount ? (
            higherPrecision ? (
              <InlineTokenBalance
                tokenAmount={tokenAmount}
                tokenFormat={tokenFormat}
                tokenDecimals={tokenDecimals}
                precision={higherPrecision}
                higherPrecision={higherPrecision}
              />
            ) : (
              _tokenAmount
            )
          ) : (
            "--"
          )}
          {tokenSymbol && (
            <Text as="span" color="hsl(0, 0%, 50%)" fontWeight="medium">
              {" "}
              {tokenSymbol}
            </Text>
          )}
        </Text>
      </HStack>
      {shouldRenderTokenAmount && usdBalance && (
        <Text
          color="hsl(0, 0%, 50%)"
          fontSize={isLarge ? "xl" : "md"}
          lineHeight={6}
        >
          {usdBalance}
        </Text>
      )}
    </Box>
  )
}

export default TokenBalance
