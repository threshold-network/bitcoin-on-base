import { NavItemDetail } from "./NavItem"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { tBTCFill } from "../../static/icons/tBTCFill"
import { tBTCOutline } from "../../static/icons/tBTCOutline"

const Sidebar = () => {
  const navItems: NavItemDetail[] = [
    {
      text: "tBTC",
      activeIcon: tBTCFill,
      passiveIcon: tBTCOutline,
      href: "/tBTC/how-it-works",
    },
  ]

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
