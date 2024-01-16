import { FC } from "react"
import {
  Box,
  BodyLg,
  BoxProps,
  Accordion as TimelineContainer,
  Badge,
  BadgeProps,
} from "@threshold-network/components"
import TimelineItem from "../components/TimelineItem"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { useWeb3React } from "@web3-react/core"

const itemsIndexes = Object.values(MintingStep)

const StyledBadge: FC<Omit<BadgeProps, "variant" | "mt" | "marginTop">> = (
  props
) => {
  const { account } = useWeb3React()
  return !!account ? null : <Badge variant="subtle" mt={4} {...props} />
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
      <TimelineContainer
        // if wallet is connected the state is controlled programatically
        // based on the minting step, otherwise the state is controlled by the
        // user
        index={!!account ? itemsIndexes.indexOf(_mintingStep) : undefined}
        // if wallet is connected the default index is undefined to prevent
        // conflicts with programatic control, otherwise the first item is open
        // by default
        defaultIndex={!!account ? undefined : 0}
      >
        <TimelineItem
          variant={!!account ? "secondary" : "primary"}
          isActive={_mintingStep === MintingStep.ProvideData}
          isComplete={
            _mintingStep === MintingStep.Deposit ||
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          number={1}
          title="Deposit Address"
        >
          Provide an ETH address and a BTC Recovery address to generate an
          unique BTC deposit address.
          <StyledBadge>ACTION OFF-CHAIN</StyledBadge>
        </TimelineItem>
        <TimelineItem
          variant={!!account ? "secondary" : "primary"}
          isActive={_mintingStep === MintingStep.Deposit}
          isComplete={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          number={2}
          title="Make a BTC deposit"
        >
          Send any amount lager than 0.01 BTC to this unique BTC Deposit
          Address. The amount sent will be used to mint tBTC.
          <StyledBadge>ACTION ON BITCOIN</StyledBadge>
        </TimelineItem>
        <TimelineItem
          variant={!!account ? "secondary" : "primary"}
          isActive={
            _mintingStep === MintingStep.InitiateMinting ||
            _mintingStep === MintingStep.MintingSuccess
          }
          // we never render the complete state for this step
          isComplete={false}
          number={3}
          title="Initiate minting"
        >
          Minting tBTC does not require you to wait for the Bitcoin
          confirmations. Sign an Ethereum transaction in your wallet and your
          tBTC will arrive in around 1 to 3 hours.
          <StyledBadge>ACTION ON ETHEREUM</StyledBadge>
        </TimelineItem>
      </TimelineContainer>
    </Box>
  )
}
