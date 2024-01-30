import { FC } from "react"
import {
  Icon,
  StackDivider,
  useColorModeValue,
  VStack,
  HStack,
  Text,
} from "@threshold-network/components"
import { WalletOption } from "../../../types"
import { WalletType } from "../../../enums"
import { HiChevronRight as ChevronRightIcon } from "react-icons/hi"

const InitialWalletSelection: FC<{
  walletOptions: WalletOption[]
  onSelect: (walletType: WalletType) => void
}> = ({ walletOptions, onSelect }) => {
  return (
    <VStack spacing={0} divider={<StackDivider />}>
      {walletOptions.map((opt) => {
        const icon = useColorModeValue(opt.icon.light, opt.icon.dark)
        return (
          <HStack
            onClick={() => onSelect(opt.id)}
            as="button"
            role="group"
            key={opt.id}
            justify="space-between"
            spacing={0}
            w="full"
            p={6}
            _hover={{
              bg: "whiteAlpha.100",
            }}
            _active={{
              bg: "whiteAlpha.200",
            }}
          >
            <HStack spacing={6}>
              <Icon
                as={icon}
                h={7}
                w={7}
                filter="grayscale(1) contrast(1.75) brightness(1.25)"
                transition="filter 0.025s ease"
                _groupHover={{
                  filter: "none",
                }}
                _groupFocusVisible={{
                  filter: "none",
                }}
              />
              <Text fontSize="xl">{opt.title}</Text>
            </HStack>
            <Icon as={ChevronRightIcon} h={5} w={5} color="brand.100" />
          </HStack>
        )
      })}
    </VStack>
  )
}

export default InitialWalletSelection
