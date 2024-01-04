import { ComponentProps, FC, ReactElement, ReactNode } from "react"
import {
  Badge,
  BodyLg,
  BodySm,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  VisuallyHidden,
  VStack,
} from "@threshold-network/components"
import { MintingStep } from "../../../../types"
import { FaChevronLeft as ChevronLeftIcon } from "react-icons/fa"

const TOTAL_STEPS = Object.keys(MintingStep).length - 1
// -1 because we don't count the success step

export const BridgeProcessCardTitle: FC<
  {
    number: number
    title: string
    description?: ReactNode
    afterDescription?: ReactNode
    onPreviousStepClick?: (previousStep: MintingStep) => void
  } & ComponentProps<typeof BodyLg>
> = ({ number, title, description, afterDescription, ...restProps }) => {
  return (
    <VStack align="start" spacing={6} {...restProps}>
      <HStack spacing={4}>
        <Flex
          as={"button"}
          align="center"
          boxShadow="inset 0 0 0 1px #333"
          minW="auto"
          h="auto"
          rounded="md"
          p={2}
        >
          <Icon as={ChevronLeftIcon} w={4} h={4} />
          <VisuallyHidden>Previous step</VisuallyHidden>
        </Flex>
        <BodySm
          rounded="md"
          bg="#1E1E1E"
          p={2}
          fontWeight="medium"
          lineHeight={4}
          color="brand.100"
        >
          {number}/{TOTAL_STEPS}
        </BodySm>
        <BodyLg as="h2" fontSize="2xl" color="white" fontWeight="medium">
          {title}
        </BodyLg>
      </HStack>
      <HStack spacing={0} justify="space-between" gap={10}>
        {!!description ? (
          <Box flex={1} color="hsla(0, 0%, 100%, 50%)">
            {description}
          </Box>
        ) : null}
        {!!afterDescription ? (
          <Box ml="minmax(auto, 40px)">{afterDescription}</Box>
        ) : null}
      </HStack>
    </VStack>
  )
}
