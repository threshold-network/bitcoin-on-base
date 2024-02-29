import { LinkProps, Link, Text, VStack, Icon, Flex } from "@chakra-ui/react"
import { FC } from "react"
import { HiOutlineArrowRight as ArrowIcon } from "react-icons/hi"

interface LandingPageCardProps extends LinkProps {
  label: string
  title: string
  href: string
}
const LandingPageCard: FC<LandingPageCardProps> = ({
  label,
  title,
  href,
  children,
  ...restProps
}) => (
  <Link
    href={href}
    _hover={{ textDecoration: "none" }}
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    rounded="2xl"
    border="1px"
    borderColor="whiteAlpha.250"
    bgColor="blackAlpha.400"
    overflow="hidden"
    {...restProps}
  >
    <Flex
      p={12}
      pb={20}
      bgGradient="linear(to bottom, whiteAlpha.200, transparent)"
    >
      <VStack spacing={4} align="flex-start" lineHeight="shorter">
        <Text fontWeight="medium" textTransform="uppercase" color="brand.100">
          {label}
        </Text>
        <Text fontFamily="accent" fontSize="3.5xl">
          {title}
        </Text>
      </VStack>
      <Icon
        as={ArrowIcon}
        color="brand.100"
        w={14}
        h={14}
        p={4}
        rounded="2xl"
        border="1px"
        borderColor="inherit"
        ml="auto"
        mr={-6}
        mt={-6}
      />
    </Flex>
    {children}
  </Link>
)

export default LandingPageCard
