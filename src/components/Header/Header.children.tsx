import {
  Flex,
  HStack,
  Link,
  List,
  ListItem,
  StackDivider,
  SystemStyleObject,
  Text,
} from "@threshold-network/components"
import { NavLink } from "react-router-dom"
import { FaBitcoin as BitcoinIcon } from "react-icons/fa"
import shortenAddress from "../../utils/shortenAddress"
import { spacing } from "@chakra-ui/theme/foundations/spacing"

const activeLinkIndicatorStyles: SystemStyleObject = {
  position: "relative",
  "&.active": {
    "&:before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 5,
      width: `calc(100% - 2 * ${spacing[5]})`, // To account for container's padding
      height: 0.5,
      bg: "#53D2FF",
    },
  },
}

interface NavigationMenuItemProps {
  /** The label of the menu item */
  label: string
  /** The route to navigate to when the menu item is clicked */
  to: string
}

function NavigationMenuItem(props: NavigationMenuItemProps) {
  const { label, to } = props
  return (
    <ListItem>
      <Link
        as={NavLink}
        to={to}
        display={"inline-flex"}
        alignItems={"center"}
        h={"full"}
        px={5}
        sx={activeLinkIndicatorStyles}
        fontWeight={"black"}
        textTransform={"uppercase"}
        _hover={{ textDecoration: "none" }}
      >
        {label}
      </Link>
    </ListItem>
  )
}

interface NavigationMenuProps {
  /** The menu items to display */
  items: NavigationMenuItemProps[]
}

export function NavigationMenu(props: NavigationMenuProps) {
  const { items } = props
  return (
    <Flex as={List} alignSelf={"stretch"} ml={146 - 20} mr={"auto"}>
      {items.map((item) => (
        <NavigationMenuItem {...item} key={item.to} />
      ))}
    </Flex>
  )
}

interface UserPanelProps {
  /** Whether the user is connected to a wallet */
  isConnected: boolean
  /** The address of the connected wallet */
  accountAddress?: Nullable<string>
  /** The balance of the connected wallet */
  balance: number
  /** The callback to invoke when the user clicks the disconnect button */
  onDisconnectClick: () => void
  /** The callback to invoke when the user clicks the connect button */
  onConnectClick: () => void
}

export function UserPanel(props: UserPanelProps) {
  const {
    isConnected,
    accountAddress,
    balance,
    onDisconnectClick,
    onConnectClick,
  } = props
  return isConnected && !!accountAddress ? (
    <HStack
      spacing={0}
      mr={-10}
      alignSelf={"stretch"}
      divider={<StackDivider borderColor={"#2E2E36"} />}
      fontWeight={"black"}
    >
      <Text fontWeight={"black"} px={6}>
        {balance}{" "}
        <Text as={"span"} opacity={"50%"}>
          BTC
        </Text>
      </Text>
      <HStack as="button" onClick={onDisconnectClick} px={10}>
        <BitcoinIcon size={24} />
        <Text as={"span"}>{shortenAddress(accountAddress)}</Text>
      </HStack>
    </HStack>
  ) : (
    <Flex as="button" onClick={onConnectClick}>
      Connect Wallet
    </Flex>
  )
}
