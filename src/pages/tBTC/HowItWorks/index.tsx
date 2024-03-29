import { SimpleGrid, VStack } from "@threshold-network/components"
import { ContractsCard } from "./ContractsCard"
import { AuditsCard } from "./AuditsCard"
import { TbtcBridgeCard } from "./TbtcBridgeCard"
import { MintingTimelineCard } from "./MintingTimelineCard"
import { JSONFileCard } from "./JSONFileCard"
import { Banner } from "./Banner"
import { PageComponent } from "../../../types"
import PageLayout from "../../PageLayout"

const HowItWorksPage: PageComponent = (props) => {
  return (
    <PageLayout renderLeft={null} renderRight={null}>
      <Banner />
      <TbtcBridgeCard mb="4" />
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="4">
        <MintingTimelineCard />
        <VStack spacing="4">
          <JSONFileCard />
          <ContractsCard />
          <AuditsCard />
        </VStack>
      </SimpleGrid>
    </PageLayout>
  )
}

HowItWorksPage.route = {
  path: "how-it-works",
  index: false,
  title: "How it Works",
  isPageEnabled: true,
}

export default HowItWorksPage
