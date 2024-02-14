import { useEffect } from "react"
import { PageComponent } from "../../../types"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import { useAppDispatch } from "../../../hooks/store"
import { tbtcSlice } from "../../../store/tbtc"
import { useWeb3React } from "@web3-react/core"
import { Outlet } from "react-router"
import { MintPage } from "./Mint"
import { UnmintPage } from "./Unmint"
import PageLayout from "../../PageLayout"
import { useLocation } from "react-router-dom"
import { MintingTimeline } from "./Minting/MintingTimeline"
import { TbtcBalanceCard } from "./TbtcBalanceCard"

const TBTCBridge: PageComponent = () => {
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!hasUserResponded) openModal(ModalType.NewTBTCApp)
  }, [hasUserResponded])

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: account,
      })
    )
  }, [dispatch, account])

  const shouldRenderSidebars = pathname.startsWith("/tBTC/mint/deposit")

  return (
    <PageLayout
      backgroundVariant="secondary"
      renderTop={<TbtcBalanceCard />}
      renderLeft={shouldRenderSidebars ? <MintingTimeline /> : null}
      renderRight={
        shouldRenderSidebars ? (
          <h2>TODO: Transaction history + Knowledgebase component</h2>
        ) : null
      }
    >
      <Outlet />
    </PageLayout>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  pathOverride: "*",
  pages: [MintPage, UnmintPage],
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
