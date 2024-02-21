import { Badge, BadgeProps, Flex, Icon, Text } from "@chakra-ui/react"
import { FC } from "react"
import { IconType } from "react-icons"

interface LabeledBadgeProps extends BadgeProps {
  label: string
  icon?: IconType
}

const LabeledBadge: FC<LabeledBadgeProps> = ({
  label,
  icon,
  children,
  ...restProps
}) => {
  return (
    <Flex
      as={Badge}
      align="center"
      color="hsl(0, 0%, 53%)"
      fontSize="xs"
      lineHeight={1}
      fontWeight="medium"
      p={2}
      pr={3}
      {...restProps}
    >
      <Icon as={icon} mr={2} w={3.5} h={3.5} />
      {label}&nbsp;
      <Text as="span" color="hsl(26, 96%, 65%)" textTransform="lowercase">
        {children}
      </Text>
    </Flex>
  )
}

export default LabeledBadge
