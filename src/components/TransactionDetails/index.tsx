import { ComponentProps, FC } from "react"
import {
  BodyMd,
  BodySm,
  ListItem,
  Skeleton,
  useColorModeValue,
} from "@threshold-network/components"
import { InlineTokenBalance } from "../TokenBalance"

type TransactionDetailsItemProps = {
  label: string
  value?: string
  isTotal?: boolean
  isSubTotal?: boolean
}

export const TransactionDetailsItem: FC<TransactionDetailsItemProps> = ({
  label,
  value,
  children,
  isTotal = false,
  isSubTotal = false,
}) => {
  return (
    <ListItem display="flex" justifyContent="space-between" alignItems="center">
      <BodyMd
        color={
          isTotal
            ? "hsl(182, 100%, 70%)"
            : isSubTotal
            ? "white"
            : "hsla(0, 0%, 100%, 50%)"
        }
      >
        {label}
      </BodyMd>
      {
        <BodyMd
          as="div"
          color={isTotal ? "hsl(182, 100%, 70%)" : "white"}
          fontWeight={isTotal || isSubTotal ? "bold" : "normal"}
        >
          {value ?? children}
        </BodyMd>
      }
    </ListItem>
  )
}

type TransactionDetailsAmountItemProps = Omit<
  ComponentProps<typeof InlineTokenBalance>,
  "tokenAmount"
> &
  Omit<TransactionDetailsItemProps, "value"> & {
    tokenAmount?: string
  }

export const TransactionDetailsAmountItem: FC<
  TransactionDetailsAmountItemProps
> = ({ label, tokenAmount, isTotal, isSubTotal, ...restProps }) => {
  return (
    <TransactionDetailsItem
      label={label}
      isTotal={isTotal}
      isSubTotal={isSubTotal}
    >
      <Skeleton isLoaded={!!tokenAmount}>
        <InlineTokenBalance
          withSymbol
          tokenAmount={tokenAmount || "0"}
          {...restProps}
        />
      </Skeleton>
    </TransactionDetailsItem>
  )
}
