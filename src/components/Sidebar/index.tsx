import { NavItemDetail } from "./NavItem"
import {
  IoLockClosedOutline,
  IoLockClosedSharp,
  IoSwapHorizontalSharp,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipsesSharp,
} from "react-icons/all"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import useUpgradeHref from "../../hooks/useUpgradeHref"
import { tBTCFill } from "../../static/icons/tBTCFill"
import { tBTCOutline } from "../../static/icons/tBTCOutline"
import { featureFlags } from "../../constants"

const Sidebar = () => {
  const { pathname } = useLocation()

  const upgradeHref = useUpgradeHref()

  const navItems: NavItemDetail[] = useMemo(() => {
    const navItems = [
      {
        text: "Upgrade",
        activeIcon: IoSwapHorizontalSharp,
        passiveIcon: IoSwapHorizontalSharp,
        href: upgradeHref,
      },
      {
        text: "Staking",
        activeIcon: IoLockClosedSharp,
        passiveIcon: IoLockClosedOutline,
        href: "/staking/how-it-works",
      },
    ]

    if (featureFlags.TBTC_V2) {
      navItems.push({
        text: "tBTC",
        activeIcon: tBTCFill,
        passiveIcon: tBTCOutline,
        href: "/tBTC/how-it-works",
      } as NavItemDetail)
    }

    if (featureFlags.FEEDBACK_MODULE) {
      navItems.push({
        text: "Feedback",
        activeIcon: IoChatbubbleEllipsesSharp,
        passiveIcon: IoChatbubbleEllipsesOutline,
        href: "/feedback/usability-survey",
      })
    }

    return navItems
  }, [pathname, upgradeHref])

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
