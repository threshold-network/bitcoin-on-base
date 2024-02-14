import { ComponentProps, FC, ReactNode } from "react"
import {
  Badge,
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

export const BridgeProcessCardTitle: FC<
  {
    badgeText: string
    title: string
    description?: ReactNode
    afterDescription?: ReactNode
    onPreviousStepClick?: (previousStep?: MintingStep) => void
  } & ComponentProps<typeof BodyLg>
> = ({
  badgeText,
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
        <Badge variant="subtle" rounded="lg" p={2} fontSize="sm" lineHeight={4}>
          {badgeText}
        </Badge>
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
