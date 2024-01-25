import { PageComponent } from "../../types"
import HowItWorksPage from "./HowItWorks"
import TBTCBridge from "./Bridge"
import { ExplorerPage } from "./Explorer"
import { Outlet } from "react-router-dom"
import useDocumentTitle from "../../hooks/useDocumentTitle"

const MainTBTCPage: PageComponent = ({ title = "tBTC" }) => {
  useDocumentTitle(`Threshold - ${title}`)
  return <Outlet />
}

MainTBTCPage.route = {
  path: "tBTC",
  index: false,
  pages: [HowItWorksPage, TBTCBridge, ExplorerPage],
  title: "tBTC",
  isPageEnabled: true,
}

export default MainTBTCPage
