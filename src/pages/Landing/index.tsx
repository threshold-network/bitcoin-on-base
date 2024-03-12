import useDocumentTitle from "../../hooks/useDocumentTitle"
import { PageComponent } from "../../types"
import LandingPageCardsSection from "./components/LandingPageCardsSection"
import LandingPageContentWrapper from "./components/LandingPageContentWrapper"
import LandingPageDecorator from "./components/LandingPageDecorator"
import LandingPageIntroSection from "./components/LandingPageIntroSection"
import LandingPageLayout from "./components/LandingPageLayout"
import LandingPagePartnersSection from "./components/LandingPagePartnersSection"

const LandingPage: PageComponent = ({ title = "tBTC" }) => {
  useDocumentTitle(`Threshold - ${title}`)
  return (
    <LandingPageLayout>
      <LandingPageIntroSection />
      <LandingPagePartnersSection />
      <LandingPageDecorator />
      {/* 
      This component will be introduced in post-MVP phases
      <LandingPageCardsSection /> 
      */}
    </LandingPageLayout>
  )
}

LandingPage.route = {
  path: "landing",
  index: true,
  title: "tBTC",
  isPageEnabled: true,
}

export default LandingPage
