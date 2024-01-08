import {
  Badge,
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  Flex,
  H5,
  HStack,
  Icon,
  Stack,
  VStack,
} from "@threshold-network/components"
import { FC } from "react"
import { getRangeSign } from "../../utils/getRangeSign"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { StackProps } from "@threshold-network/components"
import { ComponentPropsWithoutRef } from "react"
import { RangeOperatorType, CurrencyType } from "../../types"
import { useThreshold } from "../../contexts/ThresholdContext"
import { HiClock as ClockIcon } from "react-icons/hi"

type BaseProps = ComponentPropsWithoutRef<"li"> & StackProps
type MintDurationTiersItemProps = {
  amount: number
  currency: CurrencyType
  rangeOperator: RangeOperatorType
}

interface MintDurationTiersProps extends BaseProps {
  items: MintDurationTiersItemProps[]
}

const MintDurationTiers: FC<MintDurationTiersProps> = ({
  items,
  ...restProps
}) => {
  const {
    tbtc: {
      minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount,
    },
  } = useThreshold()

  return (
    <VStack spacing={2} align="start" {...restProps}>
      <BodySm fontWeight="medium" color="hsl(181, 100%, 70%)" lineHeight={1.5}>
        Minting Time Est.
      </BodySm>
      <Stack
        w="full"
        direction={{
          base: "column",
          sm: "row",
        }}
        spacing={{
          base: 3,
          md: 6,
        }}
      >
        {items.map(({ amount, rangeOperator, currency }, index) => {
          const correctedAmount =
            amount + (rangeOperator.includes("greater") ? 0.01 : -0.01)
          // The amount is corrected by adding or subtracting 0.01 to the given
          // amount depending on the range operator. This is done to avoid
          // floating-point errors when comparing BigNumber values.
          const safeAmount = Number.isSafeInteger(correctedAmount)
            ? correctedAmount
            : Math.floor((correctedAmount as number) * 1e8)
          // Only safe integers (not floating-point numbers) can be transformed to
          // BigNumber. Converting the given amount to a safe integer if it is not
          // already a safe integer. If the amount is already a safe integer, it
          // is returned as is.
          const confirmations = getNumberOfConfirmationsByAmount(safeAmount)
          const durationInMinutes =
            getDurationByNumberOfConfirmations(confirmations)
          // Round up the minutes to the nearest half-hour
          const hours = (Math.round(durationInMinutes / 30) * 30) / 60
          const formattedAmount = amount.toFixed(2)

          const hoursSuffix = hours === 1 ? "hour" : "hours"
          const confirmationsSuffix =
            confirmations === 1 ? "confirmation" : "confirmations"
          const rangeSign = getRangeSign(rangeOperator)
          return (
            <VStack
              key={index}
              align="start"
              spacing={6}
              flexFlow={{ sm: "column" }}
              flex="1"
              rounded="md"
              boxShadow="2xl"
              bg="#0D0D0D"
              border="1px solid hsla(0, 0%, 20%, 40%)"
              p={4}
            >
              <VStack spacing={0} align="start" w="full">
                <BodyMd lineHeight={5} fontWeight="medium" color="white">
                  {rangeSign} {formattedAmount} BTC
                </BodyMd>
                <BodyMd color="hsla(0, 0%, 100%, 50%)" whiteSpace="nowrap">
                  <Box as="span" color="hsl(151, 100%, 70%)">
                    + {confirmations}
                  </Box>
                  <Box as="span" lineHeight={5}>
                    &nbsp;{confirmationsSuffix}
                  </Box>
                </BodyMd>
              </VStack>
              <Flex as={Badge} align="center">
                {/* TODO: Adjust styles when Badge changes are merged. */}
                <Icon as={ClockIcon} mr={2} w={3.5} h={3.5} />
                Est. {hours} {hoursSuffix}
              </Flex>
            </VStack>
          )
        })}
      </Stack>
    </VStack>
  )
}

export default MintDurationTiers
