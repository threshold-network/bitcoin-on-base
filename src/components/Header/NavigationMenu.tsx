import { spacing } from "@chakra-ui/theme/foundations/spacing"
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Icon,
  Link,
  List,
  ListItem,
  ListItemProps,
  StackDivider,
  StackProps,
  SystemStyleObject,
  useDisclosure,
  VisuallyHidden,
  VStack,
} from "@threshold-network/components"
import { motion } from "framer-motion"
import { FC, useRef } from "react"
import { NavLink } from "react-router-dom"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"

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
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
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

export type NavigationMenuItemType = {
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
