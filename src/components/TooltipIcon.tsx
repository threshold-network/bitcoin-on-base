import {
  Icon,
  IconProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  BodySm,
  Flex,
} from "@threshold-network/components"
import { FC } from "react"
import { HiInformationCircle as InformationIcon } from "react-icons/hi"

const TooltipIcon: FC<{ label: string | JSX.Element } & IconProps> = ({
  label,
  css,
  ...iconProps
}) => {
  return (
    <Popover trigger="hover" placement="top">
      <PopoverTrigger>
        <Flex display="inline-flex" as="span">
          <Icon as={InformationIcon} w={4} h={4} {...iconProps} />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        bg="brand.100"
        border="none"
        color="black"
        rounded="xl"
        w="full"
        maxW="352px"
      >
        <PopoverArrow bg="brand.100" />
        <BodySm as={PopoverBody} p={4} color="black">
          {label}
        </BodySm>
      </PopoverContent>
    </Popover>
  )
}

export default TooltipIcon
