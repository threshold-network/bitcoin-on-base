import { FC } from "react"
import {
  Box,
  BoxProps,
  OrderedList,
  BodyMd,
  chakra,
} from "@threshold-network/components"
import { IoCheckmarkSharp as CompleteIcon } from "react-icons/all"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { motion } from "framer-motion"

const LoaderDot: FC = () => (
  <motion.div
    variants={{
      initial: {
        y: "50%",
        opacity: 0.65,
      },
      animate: {
        y: "-50%",
        opacity: 0,
      },
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  >
    <chakra.span
      display="block"
      width="4px"
      height="4px"
      borderRadius="100%"
      background="white"
    />
  </motion.div>
)

const Loader: FC = () => (
  <chakra.div
    display="flex"
    gap="0.5"
    as={motion.div}
    variants={{
      initial: {
        transition: {
          staggerChildren: 0.2,
        },
      },
      animate: {
        transition: {
          staggerChildren: 0.2,
        },
      },
    }}
    initial="initial"
    animate="animate"
  >
    <LoaderDot />
    <LoaderDot />
    <LoaderDot />
  </chakra.div>
)

type MintingTimelineItemBaseProps = {
  isActive: boolean
  isComplete: boolean
  stepNumber: number
  label: string
}

type MintingTimelineItemProps = Omit<
  MintingTimelineItemBaseProps,
  "description" | "stepNumber" | "label"
> &
  BoxProps

const MintingTimelineItem: FC<MintingTimelineItemBaseProps> = (props) => {
  const { isActive, isComplete, label, stepNumber, ...restProps } = props

  return (
    <Box
      as="li"
      position="relative"
      borderLeft={`1px solid ${
        isComplete ? "#66FFB6" : "hsla(0, 0%, 100%, 20%)"
      }`}
      pl="14"
      pb="8"
      _first={{
        pt: "8",
        borderImage: `linear-gradient(to bottom, transparent 0%, #66FFB6 50%, ${
          isComplete ? "#66FFB6" : "hsla(0, 0%, 100%, 20%)"
        } 50%) 1 100%`,
      }}
      _last={{
        borderImage:
          "linear-gradient(to bottom, hsla(0, 0%, 100%, 20%) 50%, transparent 100%) 1 100%",
      }}
      sx={{
        "&:not(:nth-last-of-type(-n+2))": {
          borderColor: isComplete ? "#66FFB6" : "hsla(0, 0%, 100%, 20%)",
        },
      }}
      {...restProps}
    >
      <Box
        position="absolute"
        left="0"
        transform="translateX(-50%)"
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="7"
        h="7"
        border="1px solid"
        borderColor={isComplete || isActive ? "#66FFB6" : "#1D1D1D"}
        color={isComplete ? "white" : "brand.500"}
        bg={isComplete ? "#66FFB6" : "black"}
      >
        {isComplete && !isActive ? (
          <CompleteIcon color="black" strokeWidth="2" size="20" />
        ) : null}
        {!isComplete && isActive ? <Loader /> : null}
      </Box>
      <BodyMd lineHeight="7">{label}</BodyMd>
    </Box>
  )
}

export const MintingTimelineStep1: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={1}
      label="Deposit Address"
      {...restProps}
    />
  )
}

export const MintingTimelineStep2: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={2}
      label="Make a BTC deposit"
      {...restProps}
    />
  )
}

export const MintingTimelineStep3: FC<MintingTimelineItemProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  return (
    <MintingTimelineItem
      isActive={isActive}
      // we never render the complete state for this step
      isComplete={isComplete}
      stepNumber={3}
      label="Initiate minting"
      {...restProps}
    />
  )
}

type MintingTimelineProps = {
  mintingStep?: MintingStep
} & BoxProps

export const MintingTimeline: FC<MintingTimelineProps> = ({
  mintingStep: mintingStepFropProps,
  ...restProps
}) => {
  const { mintingStep: mintingStepFromState } = useTbtcState()
  const _mintingStep = mintingStepFropProps ?? mintingStepFromState

  return (
    <Box {...restProps}>
      <BodyMd fontWeight="medium" mb="4">
        Timeline
      </BodyMd>
      <OrderedList listStyleType="none">
        <MintingTimelineStep1
          isActive={_mintingStep === MintingStep.ProvideData}
          isComplete={
            _mintingStep === MintingStep.Deposit ||
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
        />
        <MintingTimelineStep2
          isActive={_mintingStep === MintingStep.Deposit}
          isComplete={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
        />
        <MintingTimelineStep3
          isActive={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          // we never render the complete state for this step
          isComplete={false}
        />
      </OrderedList>
    </Box>
  )
}
