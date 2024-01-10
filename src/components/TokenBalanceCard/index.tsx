import { FC } from "react"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import { useToken } from "../../hooks/useToken"
import { TokenBalanceProps } from "../TokenBalance"

export type TokenBalanceCardProps = {
  token: Exclude<Token, Token.TBTC>
  title?: string | JSX.Element
  tokenSymbol?: string
  withSymbol?: boolean
} & Pick<
  TokenBalanceProps,
  "precision" | "withHigherPrecision" | "higherPrecision"
>

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({
  token,
  title = token,
  tokenSymbol,
  withSymbol = false,
  ...restProps
}) => {
  const { balance, usdBalance, contract, decimals } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      title={title}
      tokenBalance={balance}
      usdBalance={usdBalance}
      contract={contract}
      tokenSymbol={tokenSymbol}
      withSymbol={withSymbol}
      tokenDecimals={decimals}
      {...restProps}
    />
  )
}

export default TokenBalanceCard
