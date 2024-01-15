import { NavItemDetail } from "./NavItem"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { tBTCFill } from "../../static/icons/tBTCFill"
import { tBTCOutline } from "../../static/icons/tBTCOutline"

const Sidebar = () => {
  const { pathname } = useLocation()
  const navItems: NavItemDetail[] = useMemo(() => {
    const navItems: NavItemDetail[] = [
      {
        text: "tBTC",
        activeIcon: tBTCFill,
        passiveIcon: tBTCOutline,
        href: "/tBTC/how-it-works",
      },
    ]

    return navItems
  }, [pathname])

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
