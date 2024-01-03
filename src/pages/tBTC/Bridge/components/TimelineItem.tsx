import { FC } from "react"
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AccordionItemProps,
  Box,
  HStack,
  VStack,
  BodyMd,
  BodySm,
  Flex,
} from "@threshold-network/components"
import { StepBadge } from "../../../../components/Step"
import { IoCheckmarkSharp as CompleteIcon } from "react-icons/all"
import { DotsLoadingIndicator } from "../../../../components/DotsLoadingIndicator"
import { useWeb3React } from "@web3-react/core"

export type TimelineItemProps = {
  badgeText: string
  title: string | JSX.Element
  description: string | JSX.Element
  withBadge?: boolean
  variant?: "overview" | "detailed"
  stepNumber?: number
  isActive: boolean
  isComplete: boolean
} & AccordionItemProps

const StyledAccordionIcon: FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <AccordionIcon
    w={4}
    h={4}
    color="brand.100"
    transform={`rotate(${isExpanded ? -90 : 0}deg)`}
  />
)

const TimelineItem: FC<TimelineItemProps> = ({
  stepNumber,
  badgeText,
  title,
  description,
  variant = "overview",
  withBadge = true,
  isComplete,
  isActive,
  ...restProps
}) => {
  const { account } = useWeb3React()
  return (
    <AccordionItem
      {...restProps}
      mb={0}
      borderWidth={0}
      _last={{ borderWidth: 0, "> div": { mb: 0 } }}
    >
      {({ isExpanded }) => (
        <Box mb={isExpanded ? 8 : !!account ? 4 : 2}>
          <VStack spacing={0}>
            <HStack
              as={AccordionButton}
              spacing={2.5}
              p={0}
              pointerEvents={!!account ? "none" : "unset"}
            >
              {variant === "overview" ? (
                <StyledAccordionIcon isExpanded={isExpanded} />
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  minW={6}
                  minH={6}
                  lineHeight={6}
                  rounded="md"
                  bg={isComplete ? "#66FFB6" : "#1E1E1E"}
                  color={isComplete ? "#121212" : "brand.100"}
                >
                  {isComplete ? <CompleteIcon /> : stepNumber}
                </Flex>
              )}
              <HStack justify="space-between" w="full">
                <BodyMd color="white">{title}</BodyMd>
                {variant === "detailed" && !isComplete && isActive ? (
                  <DotsLoadingIndicator justify="end" />
                ) : null}
                {variant === "detailed" && !isActive ? (
                  <StyledAccordionIcon isExpanded={isExpanded} />
                ) : null}
              </HStack>
            </HStack>
            <AccordionPanel
              p={0}
              pl={24 + 10 /* icon width + spacing in pixels */}
              mt={2}
              _last={{ mb: 0 }}
            >
              <BodySm color="hsla(0, 0%, 100%, 50%)" fontWeight="medium">
                {description}
              </BodySm>
              {withBadge && variant === "overview" ? (
                <StepBadge>{badgeText}</StepBadge>
              ) : null}
            </AccordionPanel>
          </VStack>
        </Box>
      )}
    </AccordionItem>
  )
}

export default TimelineItem
