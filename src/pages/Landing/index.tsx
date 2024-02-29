import { Box, Image, Text } from "@chakra-ui/react"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import bobIllustration from "../../static/images/bob-illustration.svg"
import futuristicCog from "../../static/images/futuristic-cog.png"
import { PageComponent } from "../../types"
import LandingPageCard from "./components/LandingPageCard"
import LandingPageContentWrapper from "./components/LandingPageContentWrapper"
import LandingPageIntroSection from "./components/LandingPageIntroSection"
import LandingPageLayout from "./components/LandingPageLayout"
import LandingPagePartnersSection from "./components/LandingPagePartnersSection"

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
      <LandingPageIntroSection gridArea="intro" />
      <LandingPagePartnersSection gridArea="partners" />
      <LandingPageContentWrapper gridArea="loader">
        Loader
      </LandingPageContentWrapper>
      <LandingPageContentWrapper
        gridArea="cards"
        display="grid"
        gridTemplateColumns="inherit"
        gap={20}
        sx={{ perspective: "1000px" }}
      >
        <LandingPageCard
          label="Bridge"
          title="Get your Bitcoin to Base"
          href="#"
        >
          <Image src={bobIllustration} h="full" objectFit="cover" />
        </LandingPageCard>
        <LandingPageCard
          label="Collect NFT"
          title="First 1k Bitcoin on Base"
          href="#"
        >
          <Box
            fontWeight="black"
            lineHeight={0.75}
            textAlign="center"
            color="transparent"
          >
            <Text
              mb={-8}
              fontSize="7.5rem"
              bgGradient="linear(to bottom, brand.100, transparent)"
              bgClip="text"
            >
              FIRST
            </Text>
            <Text
              mb={-10}
              fontSize="15rem"
              bgGradient="linear(to bottom, brand.50, transparent)"
              bgClip="text"
            >
              1K
            </Text>
            <Image src={futuristicCog} />
          </Box>
        </LandingPageCard>
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
