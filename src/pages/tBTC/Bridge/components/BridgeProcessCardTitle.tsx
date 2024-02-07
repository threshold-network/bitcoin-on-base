import { ComponentProps, FC, ReactNode } from "react"
import {
  BodyLg,
  BodySm,
  Box,
  Flex,
  HStack,
  Icon,
  VisuallyHidden,
  VStack,
} from "@threshold-network/components"
import { MintingStep, MintingSteps as mintingSteps } from "../../../../types"
import { FaChevronLeft as ChevronLeftIcon } from "react-icons/fa"

const TOTAL_STEPS = mintingSteps.length - 1
// -1 because we don't count the success step

export const BridgeProcessCardTitle: FC<
  {
    number: number
    title: string
    description?: ReactNode
    afterDescription?: ReactNode
    onPreviousStepClick?: (previousStep?: MintingStep) => void
  } & ComponentProps<typeof BodyLg>
> = ({
  number,
  title,
  description,
  afterDescription,
  onPreviousStepClick,
  ...restProps
}) => {
  return (
    <VStack align="start" spacing={6} {...restProps}>
      <HStack spacing={4}>
        {onPreviousStepClick ? (
          <Flex
            as={"button"}
            onClick={() => onPreviousStepClick()}
            align="center"
            border="1px solid #333"
            minW="auto"
            h="auto"
            rounded="md"
            p={2}
          >
            <Icon
              as={ChevronLeftIcon}
              w={4}
              h={4}
              color="hsl(182, 100%, 70%)"
            />
            <VisuallyHidden>Previous step</VisuallyHidden>
          </Flex>
        ) : null}
        <BodySm
          rounded="md"
          bg="#1E1E1E"
          p={2}
          fontWeight="medium"
          lineHeight={4}
          color="hsl(182, 100%, 70%)"
        >
          {number}/{TOTAL_STEPS}
        </BodySm>
        <BodyLg as="h2" fontSize="2xl" color="white" fontWeight="medium">
          {title}
        </BodyLg>
      </HStack>
      <HStack spacing={0} align="start" justify="space-between" gap={10}>
        {!!description ? (
          <Box flex={1} color="hsla(0, 0%, 100%, 50%)">
            {description}
          </Box>
        ) : null}
        {!!afterDescription ? <Box>{afterDescription}</Box> : null}
      </HStack>
    </VStack>
  )
}
