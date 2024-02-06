import { FC } from "react"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import { useToken } from "../../hooks/useToken"
import { tBTCFillBlack } from "../../static/icons/tBTCFillBlack"
import { TokenBalanceProps } from "../TokenBalance"

export type TokenBalanceCardProps = {
  token: Extract<Token, Token.TBTC>
  title?: string | JSX.Element
  tokenSymbol?: string
  withSymbol?: boolean
  withUsdBalance?: boolean
  isLarge?: boolean
} & Pick<
  TokenBalanceProps,
  "precision" | "withHigherPrecision" | "higherPrecision"
>

const tokenToIconMap = {
  [Token.TBTC]: tBTCFillBlack,
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({
  token,
  title = token,
  tokenSymbol,
  withSymbol = false,
  withUsdBalance = false,
  isLarge = false,
  ...restProps
}) => {
  const { balance, usdBalance, contract, decimals } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      icon={tokenToIconMap[token]}
      title={title}
      tokenBalance={balance}
      usdBalance={withUsdBalance ? usdBalance : undefined}
      contract={contract}
      tokenSymbol={tokenSymbol}
      withSymbol={withSymbol}
      tokenDecimals={decimals}
      isLarge={isLarge}
      {...restProps}
    />
  )
}

export default TokenBalanceCard
