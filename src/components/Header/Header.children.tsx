import {
  As,
  BodyMd,
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Link,
  List,
  ListItem,
  ListItemProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackProps,
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
import { FC } from "react"

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

interface NavigationMenuItemProps extends ListItemProps {
  /** The label of the menu item */
  label: string
  /** The route to navigate to when the menu item is clicked */
  to: string
}

const NavigationMenuItem: FC<NavigationMenuItemProps> = ({
  label,
  to,
  ...restProps
}) => {
  return (
    <ListItem {...restProps}>
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

interface NavigationMenuProps extends FlexProps {
  /** The menu items to display */
  items: NavigationMenuItemProps[]
}

export const NavigationMenu: FC<NavigationMenuProps> = ({
  items,
  ...restProps
}) => {
  return (
    <Flex
      as={List}
      alignSelf={"stretch"}
      // distance between Logo and NavigationMenu minus left padding of the NavigationItem
      ml={142 - 20}
      mr={"auto"}
      {...restProps}
    >
      {items.map((item) => (
        <NavigationMenuItem {...item} key={item.to} />
      ))}
    </Flex>
  )
}

interface UserPanelProps extends StackProps {
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

export const UserPanel: FC<UserPanelProps> = ({
  isConnected,
  accountAddress,
  balance,
  chainId,
  onDisconnectClick,
  onConnectClick,
  ...restProps
}) => {
  return (
    <HStack spacing={6} alignSelf={"stretch"} {...restProps}>
      {isConnected && !!accountAddress && !!chainId ? (
        <>
          <Box as="p">
            <InlineTokenBalance
              fontWeight="medium"
              tokenAmount={balance}
              color="hsla(0, 0%, 100%, 90%)"
            />
            &nbsp;
            <BodyMd as="span" color="hsla(0, 0%, 100%, 50%)">
              tBTC
            </BodyMd>
          </Box>
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="outline"
              color="white"
              leftIcon={<Icon as={networkIconMap.get(chainId)} />}
            >
              {chainIdToNetworkName(chainId)}
            </Button>
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                size="sm"
                variant="outline"
                leftIcon={<Identicon address={accountAddress} />}
              >
                {shortenAddress(accountAddress)}
              </MenuButton>
              <MenuList
                bgGradient="radial(circle at bottom right, #0A1616, #090909)"
                border="1px solid"
                borderColor="border.50"
                rounded="lg"
              >
                <MenuItem
                  onClick={onDisconnectClick}
                  _hover={{
                    bg: "whiteAlpha.100",
                  }}
                  _active={{
                    bg: "whiteAlpha.200",
                  }}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
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
