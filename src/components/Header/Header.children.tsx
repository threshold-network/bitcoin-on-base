import { spacing } from "@chakra-ui/theme/foundations/spacing"
import {
  As,
  BodyMd,
  Box,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
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
  StackDivider,
  StackProps,
  SystemStyleObject,
  useDisclosure,
  VisuallyHidden,
  VStack,
} from "@threshold-network/components"
import { motion } from "framer-motion"
import { FC, useRef } from "react"
import { FaCogs as TestnetIcon } from "react-icons/fa"
import {
  HiOutlinePlus as PlusIcon,
  HiOutlineX as CloseIcon,
  HiOutlineMenuAlt3 as MenuIcon,
} from "react-icons/hi"
import { NavLink } from "react-router-dom"
import { ChainID } from "../../enums"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import { EthereumDark } from "../../static/icons/EthereumDark"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { InlineTokenBalance } from "../TokenBalance"

const NavigationMenuMobileContainer: FC<StackProps> = (props) => (
  <VStack
    divider={<StackDivider />}
    {...props}
    spacing={0}
    position="fixed"
    inset={0}
    h="100vh"
    py={16}
    bgGradient="radial(circle at bottom right, #0A1616, #090909)"
    borderLeft="1px solid"
    borderColor="whiteAlpha.250"
    alignItems="stretch"
  />
)

const NavigationMenuDesktopContainer: FC<StackProps> = (props) => (
  <HStack
    {...props}
    spacing={0}
    alignSelf="stretch"
    alignItems="stretch"
    ml={{
      lg: `calc(${spacing[16]} - ${spacing[5]})`,
      xl: `calc(142px - ${spacing[5]})`,
    }}
    mr="auto"
  />
)

const HamburgerIcon: FC<{ isToggled: boolean }> = ({ isToggled }) => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    w={5}
    h={5}
    fill="none"
    stroke="white"
    stroke-width={1}
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <motion.path
      initial={false}
      animate={{
        rotate: isToggled ? -45 : 0,
        y: isToggled ? "25%" : 0,
      }}
      d="M3 6h18"
    />
    <motion.path
      initial={false}
      animate={{
        scaleX: isToggled ? 0 : 1,
      }}
      d="M3 12h18"
    />
    <motion.path
      initial={false}
      animate={{
        rotate: isToggled ? 45 : 0,
        y: isToggled ? "-25%" : 0,
      }}
      d="M3 18h18"
    />
  </Icon>
)

const activeLinkIndicatorStyles: SystemStyleObject = {
  position: "relative",
  "&.active": {
    "&:before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: { base: 0, lg: 5 },
      width: { base: 0.5, lg: `calc(100% - 2 * ${spacing[5]})` }, // To account for container's padding
      height: { base: "full", lg: 0.5 },
      bg: "#53D2FF",
    },
  },
}

const networkIconMap = new Map<ChainID, As<unknown>>([
  [ChainID.Ethereum, EthereumDark],
  [ChainID.Goerli, TestnetIcon],
])

type NavigationMenuItemType = {
  /** The label of the menu item */
  label: string
  /** The route to navigate to when the menu item is clicked */
  to: string
}
interface NavigationMenuItemProps
  extends ListItemProps,
    NavigationMenuItemType {}

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
        w="full"
        h="full"
        p={5}
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

const renderNavigationMenuItems = (items: NavigationMenuItemType[]) =>
  items.map((item) => <NavigationMenuItem {...item} key={item.to} />)

interface NavigationMenuProps extends StackProps {
  /** The menu items to display */
  items: NavigationMenuItemType[]
}

export const NavigationMenu: FC<NavigationMenuProps> = ({
  items,
  ...restProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useChakraBreakpoint("lg")
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      {isMobile ? (
        <Button
          ref={buttonRef}
          variant="unstyled"
          order={-1}
          onClick={isOpen ? onClose : onOpen}
          zIndex="popover"
          mr={2}
        >
          <VisuallyHidden>
            {isOpen ? "Close" : "Open"} navigation menu
          </VisuallyHidden>
          <HamburgerIcon isToggled={isOpen} />
        </Button>
      ) : null}
      {isMobile ? (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size="sm"
          finalFocusRef={buttonRef}
        >
          <DrawerOverlay backdropFilter="auto" backdropBlur="lg" />
          <DrawerContent>
            <NavigationMenuMobileContainer as={List} {...restProps}>
              {renderNavigationMenuItems(items)}
            </NavigationMenuMobileContainer>
          </DrawerContent>
        </Drawer>
      ) : (
        <NavigationMenuDesktopContainer as={List} {...restProps}>
          {renderNavigationMenuItems(items)}
        </NavigationMenuDesktopContainer>
      )}
    </>
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
    <HStack
      spacing={{ base: 0, md: 6 }}
      alignSelf={"stretch"}
      ml="auto"
      {...restProps}
    >
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
              display={{ base: "none", md: "flex" }}
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
                borderColor="whiteAlpha.250"
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
