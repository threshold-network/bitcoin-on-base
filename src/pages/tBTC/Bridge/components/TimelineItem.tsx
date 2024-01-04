import { FC, PropsWithChildren } from "react"
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
import { IoCheckmarkSharp as CompleteIcon } from "react-icons/all"
import { DotsLoadingIndicator } from "../../../../components/DotsLoadingIndicator"

export type TimelineItemProps = {
  title: string | JSX.Element
  variant?: "overview" | "detailed"
  number?: number
  isActive: boolean
  isComplete: boolean
} & PropsWithChildren<AccordionItemProps>

const StyledAccordionIcon: FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <AccordionIcon
    w={4}
    h={4}
    color="brand.100"
    transform={`rotate(${isExpanded ? -90 : 0}deg)`}
  />
)

const TimelineItem: FC<TimelineItemProps> = ({
  number,
  title,
  variant = "overview",
  isComplete,
  isActive,
  children,
  ...restProps
}) => {
  return (
    <AccordionItem
      {...restProps}
      mb={0}
      borderWidth={0}
      _last={{ borderWidth: 0, "> div": { mb: 0 } }}
    >
      {({ isExpanded }) => (
        <Box mb={isExpanded ? 8 : variant === "detailed" ? 4 : 2}>
          <VStack spacing={0}>
            <HStack
              as={AccordionButton}
              spacing={2.5}
              p={0}
              pointerEvents={variant === "detailed" ? "none" : "unset"}
              _hover={{ bg: "transparent" }}
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
                  {isComplete ? <CompleteIcon /> : number}
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
              pl={
                (variant === "detailed" ? 24 : 16) +
                10 /* icon width + spacing in pixels */
              }
              mt={2}
              _last={{ mb: 0 }}
            >
              <BodySm color="hsla(0, 0%, 100%, 50%)" fontWeight="medium">
                {children}
              </BodySm>
            </AccordionPanel>
          </VStack>
        </Box>
      )}
    </AccordionItem>
  )
}

export default TimelineItem
