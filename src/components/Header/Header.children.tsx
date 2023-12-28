import {
  As,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  List,
  ListItem,
  SystemStyleObject,
} from "@threshold-network/components"
import { NavLink } from "react-router-dom"
import { FaCogs as TestnetIcon } from "react-icons/fa"
import shortenAddress from "../../utils/shortenAddress"
import { spacing } from "@chakra-ui/theme/foundations/spacing"
import { HiOutlinePlus as PlusIcon } from "react-icons/hi"
import { InlineTokenBalance } from "../TokenBalance"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import { EthereumDark } from "../../static/icons/EthereumDark"
import { ChainID } from "../../enums"
import Identicon from "../Identicon"

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

const networkIconMap = new Map<ChainID, As<unknown>>([
  [ChainID.Ethereum, EthereumDark],
  [ChainID.Goerli, TestnetIcon],
])

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
  balance: number | string
  /** The identifier of the chain */
  chainId?: Nullable<number>
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
    chainId,
    onDisconnectClick,
    onConnectClick,
  } = props
  return (
    <HStack spacing={6} alignSelf={"stretch"}>
      {isConnected && !!accountAddress && !!chainId ? (
        <>
          <InlineTokenBalance
            fontWeight="medium"
            tokenAmount={balance}
            withSymbol
            tokenSymbol="BTC"
          />
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="outline"
              color="white"
              leftIcon={<Icon as={networkIconMap.get(chainId)} />}
            >
              {chainIdToNetworkName(chainId)}
            </Button>
            <Button
              onClick={onDisconnectClick}
              size="sm"
              variant="outline"
              leftIcon={<Identicon address={accountAddress} />}
            >
              {shortenAddress(accountAddress)}
            </Button>
          </HStack>
        </>
      ) : (
        <Button
          variant="outline"
          leftIcon={<PlusIcon />}
          onClick={onConnectClick}
          size="sm"
        >
          Connect Wallet
        </Button>
      )}
    </HStack>
  )
}
