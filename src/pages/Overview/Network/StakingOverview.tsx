import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { BodyMd } from "@threshold-network/components"
import { useTokenState } from "../../../hooks/useTokenState"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import { StakingContractLearnMore } from "../../../components/Link"
import ButtonLink from "../../../components/ButtonLink"

const StakingOverview: FC = () => {
  const { t } = useTokenState()
  const stakedBalance = "1" // Note: temporary solution, it will be removed in separate PR

  return (
    <CardTemplate title="STAKING" height="fit-content">
      <BodyMd mb={3} mt={4}>
        My Staked Balance
      </BodyMd>
      <InfoBox>
        <TokenBalance
          icon={t.icon}
          tokenAmount={stakedBalance.toString()}
          isLarge
        />
      </InfoBox>
      <ButtonLink size="lg" isFullWidth mt={4} to="/staking">
        Go to Staking
      </ButtonLink>
      <StakingContractLearnMore mt="4" />
    </CardTemplate>
  )
}

export default StakingOverview
