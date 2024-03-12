import {
  Badge,
  BadgeProps,
  BodyLg,
  Box,
  BoxProps,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FC, ReactNode, useMemo } from "react"
import { HiClock as ClockIcon } from "react-icons/hi"
import { useLocation } from "react-router"
import { LabeledBadge } from "../../../../components/LabeledBadge"
import { Timeline, TimelineItemProps } from "../../../../components/Timeline"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import {
  DepositDetailsStep,
  DepositDetailsSteps,
  MintingStep,
  MintingSteps,
} from "../../../../types/tbtc"

const StyledBadge: FC<Omit<BadgeProps, "variant" | "mt" | "marginTop">> = (
  props
) => {
  const { account } = useWeb3React()
  return account ? null : (
    <Badge
      variant="subtle"
      width="fit-content"
      display="block"
      mt={4}
      {...props}
    />
  )
}

type TimelineItemType = {
  id: DepositDetailsStep | MintingStep
  label: string
  description: ReactNode
}

const MINTING_ITEMS: TimelineItemType[] = [
  {
    id: MintingStep.ProvideData,
    label: "Deposit Address",
    description: (
      <>
        Provide an ETH address and a BTC Recovery address to generate an unique
        BTC deposit address.
        <StyledBadge>ACTION OFF-CHAIN</StyledBadge>
      </>
    ),
  },
  {
    id: MintingStep.Deposit,
    label: "Make a BTC deposit",
    description: (
      <>
        Send any amount lager than 0.01 BTC to this unique BTC Deposit Address.
        The amount sent will be used to mint tBTC.
        <StyledBadge>ACTION ON BITCOIN</StyledBadge>
      </>
    ),
  },
  {
    id: MintingStep.InitiateMinting,
    label: "Initiate minting",
    description: (
      <>
        Minting tBTC does not require you to wait for the Bitcoin confirmations.
        Sign an Ethereum transaction in your wallet and your tBTC will arrive in
        around 1 to 3 hours.
        <StyledBadge>ACTION ON ETHEREUM</StyledBadge>
      </>
    ),
  },
]

const DEPOSIT_DETAILS_ITEMS: TimelineItemType[] = [
  {
    id: DepositDetailsStep.BitcoinConfirmations,
    label: "Bitcoin Confirmations",
    description:
      "Minting tBTC does not require you to wait for the Bitcoin confirmations. Sign an Ethereum transaction in your wallet and your tBTC will arrive in around 1 to 3 hours.",
  },
  {
    id: DepositDetailsStep.MintingInitialized,
    label: "Minter Check",
    description: (
      <>
        Our Minters are inspecting the deposit. A Minter will initiate the token
        issuance if the deposit is confirmed.
        <br />
        <br />A Minter is a software empowered by the Threshold DAO. They
        provide security against malicious deposits.
      </>
    ),
  },
  {
    id: DepositDetailsStep.GuardianCheck,
    label: "Guardian Check",
    description: (
      <>
        Our Guardians are inspecting the deposit. This is the second layer of
        deposit validation.
        <br />
        <br />
        Guardians are software empowered by the DAO. They can deny token
        issuance, if the Bitcoin deposit is not confirmed.
      </>
    ),
  },
  {
    id: DepositDetailsStep.Completed,
    label: "Completing Deposit",
    description: "The contract is sending and minting your tBTC tokens.",
  },
]

type MintingTimelineProps = {
  title: string
} & BoxProps

export const MintingDepositTimeline: FC<MintingTimelineProps> = ({
  title,
  ...restProps
}) => {
  const { mintingStep, depositDetailsStep } = useTbtcState()
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const isOnDepositDetailsPage = pathname.startsWith("/tBTC/mint/deposit")

  const currentIndex = useMemo(() => {
    const items = isOnDepositDetailsPage ? DepositDetailsSteps : MintingSteps
    const step = isOnDepositDetailsPage ? depositDetailsStep : mintingStep
    // if wallet is connected the state is controlled programatically
    // based on the minting step, otherwise the state is controlled by the
    // user
    return account || isOnDepositDetailsPage
      ? items.indexOf(step as never)
      : undefined
  }, [mintingStep, depositDetailsStep, account, isOnDepositDetailsPage])

  const variant = useMemo(() => {
    if (isOnDepositDetailsPage) return "pulse"
    return account ? "numbered" : "simple"
  }, [account, isOnDepositDetailsPage])

  // This variable contains mutated data to be iterated by the Timeline
  // component. It conditionally chooses the correct data based on the
  // current page and mutates data based on the current deposit or minting
  // step to define if the item is active and/or complete.
  const items = useMemo<TimelineItemProps[]>(() => {
    if (isOnDepositDetailsPage) {
      return DEPOSIT_DETAILS_ITEMS.map(({ id, label, description }) => {
        const currentStepIndex = depositDetailsStep
          ? DepositDetailsSteps.indexOf(depositDetailsStep)
          : 0
        const itemIdIndex = DepositDetailsSteps.indexOf(
          id as DepositDetailsStep
        )
        const isComplete = itemIdIndex < currentStepIndex
        const isActive = id === depositDetailsStep

        return {
          label,
          children: description,
          isActive,
          isComplete,
        }
      })
    }

    return MINTING_ITEMS.map(({ id, label, description }, index) => {
      const currentStepIndex = MintingSteps.indexOf(mintingStep)
      const itemIdIndex = MintingSteps.indexOf(id as MintingStep)
      const isComplete = itemIdIndex < currentStepIndex
      const isActive = isComplete || id === mintingStep

      return {
        label,
        children: description,
        step: ++index,
        isActive,
        isComplete,
      }
    })
  }, [mintingStep, depositDetailsStep, account, isOnDepositDetailsPage])
  return (
    <Box {...restProps}>
      <BodyLg
        color="hsl(0, 0%, 50%)"
        fontWeight="medium"
        mb={isOnDepositDetailsPage ? 2 : account ? 10 : 6}
        lineHeight={6}
      >
        {title}
      </BodyLg>
      {/* {isOnDepositDetailsPage && (
        // TOOD: calculate elapsed time
        <LabeledBadge icon={ClockIcon} label="Elapsed time" mb={10}>
          3 hrs
        </LabeledBadge>
      )} */}
      <Timeline
        items={items}
        index={currentIndex}
        variant={variant}
        // if wallet is connected the default index is undefined to prevent
        // conflicts with programmatic control, otherwise the first item is open
        // by default
        defaultIndex={isOnDepositDetailsPage || account ? undefined : 0}
      />
    </Box>
  )
}
