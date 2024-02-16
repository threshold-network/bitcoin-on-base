import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  Box,
  BoxProps,
  Flex,
  HStack,
  Icon,
  VStack,
  Text,
} from "@chakra-ui/react"
import { FC } from "react"
import { IoCheckmarkSharp as CompleteIcon } from "react-icons/all"
import { DotsLoadingIndicator } from "../DotsLoadingIndicator"

export type TimelineItemVariantType = "simple" | "numbered" | "pulse"

export type TimelineItemProps = {
  label: string
  variant?: TimelineItemVariantType
  step?: number
  isActive: boolean
  isComplete: boolean
} & AccordionItemProps

const StyledAccordionIcon: FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <AccordionIcon
    w={4}
    h={4}
    color="hsl(182, 100%, 70%)"
    transform={`rotate(${isExpanded ? 0 : -90}deg)`}
  />
)

type BulletSymbolStatus = "completed" | "active" | "inactive"
const BulletSymbol: FC<{ status?: BulletSymbolStatus } & BoxProps> = ({
  status = "inactive",
}) => {
  const baseColors: [BulletSymbolStatus, string][] = [
    ["completed", "hsl(151, 100%, 70%)"],
    ["active", "hsl(182, 100%, 70%)"],
  ]
  const backgroundColor = new Map<BulletSymbolStatus, string>([
    ...baseColors,
    ["inactive", "transparent"],
  ])

  const outlineColor = new Map<BulletSymbolStatus, string>([
    ...baseColors,
    ["inactive", "hsl(0, 0%, 20%)"],
  ])

  return (
    <Box
      rounded="full"
      w={status !== "completed" ? 3 : 6}
      h={status !== "completed" ? 3 : 6}
      bgColor={backgroundColor.get(status)}
      outline={
        status !== "completed"
          ? `1px solid ${outlineColor.get(status)}`
          : undefined
      }
      outlineOffset={"5px" /* 6px - 1px of outline thickness */}
    >
      {status === "completed" ? (
        <Icon
          as={CompleteIcon}
          w="full"
          h="full"
          p={1.5}
          color="hsl(0, 0%, 7%)"
        />
      ) : null}
    </Box>
  )
}

const SimpleTimelineItem: FC<Omit<TimelineItemProps, "variant">> = ({
  step,
  label,
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
      _last={{
        borderWidth: 0,
        "> div": {
          mb: 0,
        },
      }}
    >
      {({ isExpanded }) => (
        <VStack spacing={0} pb={isExpanded ? 0 : 2}>
          <HStack
            as={AccordionButton}
            spacing={2.5}
            p={0}
            _hover={{ bg: "transparent" }}
          >
            <StyledAccordionIcon isExpanded={isExpanded} />
            <Text color="white" align="left" w="full">
              {label}
            </Text>
          </HStack>
          <AccordionPanel
            pt={0}
            pr={0}
            pb={8}
            pl={16 + 10 /* icon width + spacing in pixels */}
            mt={2}
            mb={0}
            ml={0}
            color="hsla(0, 0%, 100%, 50%)"
            fontSize="sm"
            lineHeight={5}
            fontWeight="medium"
          >
            {children}
          </AccordionPanel>
        </VStack>
      )}
    </AccordionItem>
  )
}
const NumberedTimelineItem: FC<Omit<TimelineItemProps, "variant">> = ({
  step,
  label,
  isComplete,
  isActive,
  children,
  ...restProps
}) => {
  return (
    <AccordionItem
      {...restProps}
      mb={4}
      borderWidth={0}
      _last={{
        mb: 0,
      }}
    >
      {({ isExpanded }) => (
        <VStack spacing={0}>
          <HStack
            as={AccordionButton}
            spacing={3}
            p={0}
            _hover={{ bg: "transparent" }}
          >
            <Flex
              align="center"
              justify="center"
              minW={6}
              minH={6}
              fontSize="sm"
              lineHeight={4}
              rounded="md"
              bg={isComplete ? "hsl(151, 100%, 70%)" : "hsl(0, 0%, 12%)"}
              color={isComplete ? "hsl(0, 0%, 7%)" : "hsl(182, 100%, 70%)"}
            >
              {isComplete ? <CompleteIcon /> : step}
            </Flex>
            <HStack color="white" justify="space-between" w="full">
              <Text>{label}</Text>
              {!isComplete && isActive ? (
                <DotsLoadingIndicator justify="end" />
              ) : null}
              {!isActive ? (
                <StyledAccordionIcon isExpanded={isExpanded} />
              ) : null}
            </HStack>
          </HStack>
          <AccordionPanel
            p={0}
            pl={9 /* icon width + spacing in pixels */}
            m={0}
            mt={2}
            mb={4}
            color="hsla(0, 0%, 100%, 50%)"
            fontWeight="medium"
            fontSize="sm"
            lineHeight={5}
          >
            {children}
          </AccordionPanel>
        </VStack>
      )}
    </AccordionItem>
  )
}

const PulseTimelineItem: FC<Omit<TimelineItemProps, "variant">> = ({
  step,
  label,
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
      _last={{
        borderWidth: 0,
        "> div": {
          mb: 0,
          "&::after": { display: "none" },
          ".chakra-accordion__panel": {
            borderLeftWidth: 0,
          },
        },
      }}
    >
      {({ isExpanded }) => (
        <VStack
          align="start"
          spacing={0}
          _after={
            !isExpanded
              ? {
                  content: "''",
                  display: "block",
                  h: 4,
                  borderLeft: "1px solid",
                  borderLeftColor: isComplete
                    ? "hsl(151, 100%, 70%)"
                    : "hsl(0, 0%, 12%)",
                  my: 2,
                  ml: 3,
                }
              : undefined
          }
        >
          <HStack
            as={AccordionButton}
            spacing={6}
            p={0}
            _hover={{ bg: "transparent" }}
          >
            <Flex
              align="center"
              justify="center"
              minW={6}
              minH={6}
              lineHeight={6}
              rounded="md"
              color={isComplete ? "hsl(0, 0%, 7%)" : "hsl(182, 100%, 70%)"}
            >
              <BulletSymbol
                status={
                  isActive ? "active" : isComplete ? "completed" : "inactive"
                }
              />
            </Flex>
            <Text
              align="left"
              color={isActive || isComplete ? "white" : "hsl(0, 0%, 27%)"}
              w="full"
            >
              {label}
            </Text>
          </HStack>
          <AccordionPanel
            pt={0}
            pr={0}
            pb={6}
            pl={9}
            mt={2}
            mb={2}
            ml={3}
            borderLeft="1px solid"
            borderLeftColor={
              isComplete
                ? "hsl(171, 100%, 70%)"
                : isActive
                ? "hsl(0, 0%, 12%)"
                : "transparent"
            }
            fontSize="sm"
            lineHeight={5}
            fontWeight="medium"
            color="hsla(0, 0%, 50%)"
          >
            {children}
          </AccordionPanel>
        </VStack>
      )}
    </AccordionItem>
  )
}

const TimelineItem: FC<TimelineItemProps> = ({
  variant = "simple",
  ...restProps
}) => {
  const Component = {
    simple: SimpleTimelineItem,
    numbered: NumberedTimelineItem,
    pulse: PulseTimelineItem,
  }[variant]

  return <Component {...restProps} />
}

export default TimelineItem
