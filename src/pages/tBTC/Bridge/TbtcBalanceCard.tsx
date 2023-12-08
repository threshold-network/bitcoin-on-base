import { FC, ComponentProps } from "react"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { Token } from "../../../enums"
import { Card, Box } from "@threshold-network/components"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...restProps
}) => {
  return (
    <TokenBalanceCard
      token={Token.TBTCV2}
      title="My Balance"
      tokenSymbol={"tBTC"}
      withSymbol={true}
      withHigherPrecision={true}
      {...restProps}
    />
  )
}
