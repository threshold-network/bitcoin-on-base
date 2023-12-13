import { FC } from "react"
import { HStack, Stack } from "@chakra-ui/react"
import { BodySm } from "@threshold-network/components"

export interface TransactionInfo {
  text: string
  value: JSX.Element
}

const TransactionInfoTable: FC<{ transactionInfo: TransactionInfo[] }> = ({
  transactionInfo,
}) => {
  return (
    <Stack spacing="0.5rem" marginTop={6}>
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <BodySm color="hsla(0, 0%, 100%, 50%)">{info.text}</BodySm>
          <BodySm fontWeight="bold" color="white">
            {info.value}
          </BodySm>
        </HStack>
      ))}
    </Stack>
  )
}

export default TransactionInfoTable
