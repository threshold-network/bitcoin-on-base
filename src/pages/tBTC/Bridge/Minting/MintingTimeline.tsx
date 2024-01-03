import { FC } from "react"
import {
  LabelSm,
  Box,
  BodyLg,
  BoxProps,
  Accordion,
} from "@threshold-network/components"
import TimelineItem, { TimelineItemProps } from "../components/TimelineItem"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { useWeb3React } from "@web3-react/core"

type MintingTimelineStepProps = Omit<
  TimelineItemProps,
  "stepNumber" | "badgeText" | "title" | "description"
>

const itemsIndexes = Object.values(MintingStep)

export const MintingTimelineStep1: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  const { account } = useWeb3React()
  return (
    <TimelineItem
      variant={!!account ? "detailed" : "overview"}
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={1}
      badgeText="ACTION OFF-CHAIN"
      title="Deposit Address"
      description="Provide an ETH address and a BTC Recovery address to generate an unique BTC deposit address."
      {...restProps}
    />
  )
}

export const MintingTimelineStep2: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  const { account } = useWeb3React()
  return (
    <TimelineItem
      variant={!!account ? "detailed" : "overview"}
      isActive={isActive}
      isComplete={isComplete}
      stepNumber={2}
      badgeText="ACTION ON BITCOIN"
      title="Make a BTC deposit"
      description="Send any amount lager than 0.01 BTC to this unique BTC Deposit Address. The amount sent will be used to mint tBTC."
      {...restProps}
    />
  )
}

export const MintingTimelineStep3: FC<MintingTimelineStepProps> = ({
  isActive,
  isComplete,
  ...restProps
}) => {
  const { account } = useWeb3React()
  return (
    <TimelineItem
      variant={!!account ? "detailed" : "overview"}
      isActive={isActive}
      // we never render the complete state for this step
      isComplete={isComplete}
      stepNumber={3}
      badgeText="ACTION ON ETHEREUM"
      title="Initiate minting"
      description="Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours."
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
  const { account } = useWeb3React()
  return (
    <Box {...restProps}>
      <BodyLg fontWeight="medium" mb={!!account ? 10 : 6} lineHeight={6}>
        Minting Timeline
      </BodyLg>
      <Accordion
        index={!!account ? itemsIndexes.indexOf(_mintingStep) : undefined}
        defaultIndex={!!account ? undefined : 0}
      >
        <MintingTimelineStep1
          isActive={_mintingStep === MintingStep.ProvideData}
          isComplete={
            _mintingStep === MintingStep.Deposit ||
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          mb="4"
        />
        <MintingTimelineStep2
          isActive={_mintingStep === MintingStep.Deposit}
          isComplete={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          withBadge
          mb="4"
        />
        <MintingTimelineStep3
          isActive={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          // we never render the complete state for this step
          isComplete={false}
          withBadge
          mb="4"
        />
      </Accordion>
    </Box>
  )
}
