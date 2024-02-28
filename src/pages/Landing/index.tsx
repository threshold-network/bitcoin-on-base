import { PageComponent } from "../../types"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import LandingPageLayout from "./components/LandingPageLayout"
import LandingPageContentWrapper from "./components/LandingPageContentWrapper"

const LandingPage: PageComponent = ({ title = "tBTC" }) => {
  useDocumentTitle(`Threshold - ${title}`)
  return (
    <LandingPageLayout
      gridTemplateAreas={`
      "intro    loader"
      "partners loader"
      "cards    cards "
    `}
    >
      <LandingPageContentWrapper gridArea="intro">
        Intro
      </LandingPageContentWrapper>
      <LandingPageContentWrapper
        gridArea="partners"
        borderY="1px"
        borderColor="inherit"
      >
        Partners
      </LandingPageContentWrapper>
      <LandingPageContentWrapper gridArea="loader">
        Loader
      </LandingPageContentWrapper>
      <LandingPageContentWrapper
        gridArea="cards"
        display="grid"
        gridTemplateColumns="inherit"
        gap={20}
      >
        Cards
      </LandingPageContentWrapper>
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
