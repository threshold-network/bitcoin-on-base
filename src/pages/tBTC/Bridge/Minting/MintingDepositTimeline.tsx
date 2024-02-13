import { FC, ReactNode, useMemo } from "react"
import {
  Box,
  BodyLg,
  BoxProps,
  Badge,
  BadgeProps,
} from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import {
  DepositDetailsStep,
  MintingStep,
  MintingSteps,
} from "../../../../types/tbtc"
import { useWeb3React } from "@web3-react/core"
import { useLocation } from "react-router"
import { Timeline, TimelineItemProps } from "../../../../components/Timeline"

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
  const { mintingStep, depositStep } = useTbtcState()
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const isDepositPageRouteActive = pathname.startsWith("/tBTC/mint/deposit")

  const currentIndex = useMemo(() => {
    const items = Object.values(
      isDepositPageRouteActive ? DepositDetailsStep : MintingStep
    )
    const step = isDepositPageRouteActive ? depositStep : mintingStep
    // if wallet is connected the state is controlled programatically
    // based on the minting step, otherwise the state is controlled by the
    // user
    return account || isDepositPageRouteActive ? items.indexOf(step) : undefined
  }, [mintingStep, depositStep, account, isDepositPageRouteActive])

  const variant = useMemo(() => {
    if (isDepositPageRouteActive) return "tertiary"
    return account ? "secondary" : "primary"
  }, [account, isDepositPageRouteActive])

  const items = useMemo<TimelineItemProps[]>(() => {
    if (isDepositPageRouteActive) {
      return DEPOSIT_DETAILS_ITEMS.map(({ id, label, description }) => {
        const currentStepIndex = depositStep
          ? Object.values(DepositDetailsStep).indexOf(depositStep)
          : 0
        const itemIdIndex = Object.values(DepositDetailsStep).indexOf(
          id as DepositDetailsStep
        )
        const isComplete = itemIdIndex < currentStepIndex
        const isActive = id === depositStep

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
        number: ++index,
        isActive,
        isComplete,
      }
    })
  }, [mintingStep, depositStep, account, isDepositPageRouteActive])
  return (
    <Box {...restProps}>
      <BodyLg
        color="hsl(0, 0%, 50%)"
        fontWeight="medium"
        mb={isDepositPageRouteActive || account ? 10 : 6}
        lineHeight={6}
      >
        {title}
      </BodyLg>
      <Timeline
        items={items}
        index={currentIndex}
        variant={variant}
        // if wallet is connected the default index is undefined to prevent
        // conflicts with programatic control, otherwise the first item is open
        // by default
        defaultIndex={isDepositPageRouteActive || account ? undefined : 0}
      />
    </Box>
  )
}
