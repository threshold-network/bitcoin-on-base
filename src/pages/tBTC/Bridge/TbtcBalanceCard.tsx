import { FC, ComponentProps } from "react"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { Token } from "../../../enums"
import { Card } from "@threshold-network/components"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...restProps
}) => {
  return (
    <TokenBalanceCard
      token={Token.TBTC}
      title="tBTC Balance"
      tokenSymbol={"tBTC"}
      higherPrecision={6}
      withSymbol={true}
      {...restProps}
    />
  )
}
