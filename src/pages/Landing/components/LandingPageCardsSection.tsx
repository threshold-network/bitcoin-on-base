import { ComponentProps, FC } from "react"
import { Box, Text, Image } from "@chakra-ui/react"
import LandingPageContentWrapper from "./LandingPageContentWrapper"
import bobIllustration from "../../../static/images/bob-illustration.svg"
import futuristicCog from "../../../static/images/futuristic-cog.png"
import LandingPageCard, { LandingPageCardProps } from "./LandingPageCard"

type CardsDataType = Pick<
  LandingPageCardProps,
  "label" | "title" | "href" | "children"
>[]

const cardsData: CardsDataType = [
  {
    label: "Bridge",
    title: "Get your Bitcoin to Base",
    href: "#",
    children: <Image src={bobIllustration} h="full" objectFit="cover" />,
  },
  {
    label: "Collect NFT",
    title: "First 1k Bitcoin on Base",
    href: "#",
    children: (
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
    ),
  },
]

const LandingPageCardsSection: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper
    gridArea={{ xl: "cards" }}
    display="grid"
    gridTemplateColumns={{ lg: "repeat(2, 1fr)" }}
    gap={20}
    sx={{ perspective: "1600px" }}
    {...props}
  >
    {cardsData.map((card, index) => (
      <LandingPageCard key={index} {...card} />
    ))}
  </LandingPageContentWrapper>
)

export default LandingPageCardsSection
