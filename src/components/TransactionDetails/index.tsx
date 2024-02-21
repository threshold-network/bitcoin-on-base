import { ComponentProps, FC } from "react"
import { Text, ListItem, Skeleton, useMultiStyleConfig } from "@chakra-ui/react"
import { InlineTokenBalance } from "../TokenBalance"

type TransactionDetailsItemProps = {
  label: string
  value?: string
  variant?: "simple" | "bold" | "highlight"
}

export const TransactionDetailsItem: FC<TransactionDetailsItemProps> = ({
  label,
  value,
  children,
  ...restProps
}) => {
  const styles = useMultiStyleConfig("TransactionDetailsItem", restProps)

  return (
    <ListItem sx={styles.container}>
      <Text sx={styles.label}>{label}</Text>
      {
        <Text as="div" sx={styles.value}>
          {value ?? children}
        </Text>
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
> = ({ label, tokenAmount, variant, ...restProps }) => {
  return (
    <TransactionDetailsItem label={label} variant={variant}>
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
