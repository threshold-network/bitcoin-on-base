import { FC } from "react"
import { HStack, Divider, Flex, Text } from "@threshold-network/components"
import { IconType } from "react-icons"
import { FiArrowRight as PlainArrowIcon } from "react-icons/fi"
import { BitcoinDuotone as BitcoinIcon } from "../../../../static/icons/BitcoinDuotone"
import { BaseDuotone as BaseIcon } from "../../../../static/icons/BaseDuotone"

const ArrowIcon: IconType = (props) => (
  <Flex
    align="center"
    justify="center"
    w="10"
    h="10"
    rounded="full"
    border="1px solid hsla(0, 0%, 100%, 10%)"
    bg="black"
    zIndex="1"
  >
    <PlainArrowIcon size="24" color="white" {...props} />
  </Flex>
)

const ChainName: FC<{ label: string; icon: IconType }> = ({
  label,
  icon: Icon,
}) => (
  <HStack spacing="2.5" px="6" py="10" justify="center" flex="1">
    <Text
      fontSize="24"
      lineHeight="1"
      textTransform="uppercase"
      fontWeight="medium"
    >
      {label}
    </Text>
    <Icon />
  </HStack>
)

export const BridgeProcessTitle: FC = (props) => {
  return (
    <Flex
      flexDirection="row"
      position="relative"
      justify="space-evenly"
      align="center"
      borderBottom="1px solid hsla(0, 0%, 100%, 10%)"
      {...props}
    >
      <ChainName label="Bitcoin" icon={BitcoinIcon} />
      <ArrowIcon />
      <Divider
        orientation="vertical"
        position="absolute"
        inset="50%"
        transform="translate(-50%, -50%)"
        borderColor="hsla(0, 0%, 100%, 10%)"
        opacity="1"
      />
      <ChainName label="Base" icon={BaseIcon} />
    </Flex>
  )
}
