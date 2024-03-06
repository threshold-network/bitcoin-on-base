import { ComponentProps, FC } from "react"
import { HStack, Icon, Text } from "@chakra-ui/react"
import { Logo } from "../../../components/Logo"
import { Bitcoin as BitcoinIcon } from "../../../static/icons/Bitcoin"
import { Base as BaseIcon } from "../../../static/icons/Base"
import LandingPageContentWrapper from "./LandingPageContentWrapper"
import ButtonLink from "../../../components/ButtonLink"
import { HiChevronRight as ChevronRightIcon } from "react-icons/hi"

const LandingPageIntroSection: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper gridArea={{ xl: "intro" }} {...props}>
    <Text
      fontFamily="accent"
      fontWeight="semibold"
      fontSize="3.5xl"
      lineHeight="shorter"
      textTransform="uppercase"
      mb={6}
    >
      Bitcoin
      <Logo display="inline-block" mx={2} />
      Base
    </Text>
    <HStack spacing={-2} mb={20}>
      <BitcoinIcon w={20} h={20} p={3} bg="hsl(33, 93%, 54%)" rounded="full" />
      <BaseIcon w={20} h={20} p={3} bg="hsl(221, 100%, 50%)" rounded="full" />
    </HStack>
    <Text
      fontSize="6.25rem" // 100px
      lineHeight="5.625rem" // 90px
      fontFamily="accent"
      fontWeight="medium"
      mb={10}
    >
      Earn with your{" "}
      <Text as="span" color="brand.100">
        Bitcoin on Base
      </Text>
    </Text>
    <Text
      fontFamily="accent"
      fontWeight="medium"
      fontSize="3.5xl"
      lineHeight="shorter"
      mb={12}
    >
      tBTC makes your Bitcoin work with finance and NFT apps on Base.
    </Text>
    <ButtonLink to="/tBTC" rightIcon={<Icon as={ChevronRightIcon} />} mb={20}>
      Mint tBTC
    </ButtonLink>
  </LandingPageContentWrapper>
)

export default LandingPageIntroSection
