import { ComponentProps, FC } from "react"
import { Flex, Text, Image } from "@chakra-ui/react"
import aerodromeLogoSrc from "../../../static/images/aerodrome-logo.svg"
import fxdxLogoSrc from "../../../static/images/fxdx-logo.svg"
import balancerLogoSrc from "../../../static/images/balancer-logo.svg"
import LandingPageContentWrapper from "./LandingPageContentWrapper"

const partnersData = [
  {
    name: "Aerodrome",
    imageSrc: aerodromeLogoSrc,
  },
  {
    name: "fxdx",
    imageSrc: fxdxLogoSrc,
  },
  {
    name: "Balancer",
    imageSrc: balancerLogoSrc,
  },
]

const LandingPagePartnersSection: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper
    gridArea="partners"
    borderY="1px"
    borderColor="inherit"
    {...props}
  >
    <Text
      fontFamily="accent"
      fontWeight="medium"
      fontSize="2xl"
      lineHeight="taller"
      color="hsl(100, 0%, 50%)"
      mb={4}
    >
      Pool Partners
    </Text>
    <Flex wrap="wrap" columnGap={24} rowGap={12}>
      {partnersData.map(({ name, imageSrc }) => (
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={`${name} logo`}
          w="auto"
          h="full"
          maxH={7}
        />
      ))}
    </Flex>
  </LandingPageContentWrapper>
)

export default LandingPagePartnersSection
