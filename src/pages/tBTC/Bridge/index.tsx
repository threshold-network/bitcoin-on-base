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
import { useParams } from "react-router"
import { MintingTimeline } from "./Minting/MintingTimeline"
import { KnowledgebaseLinks } from "./Minting/KnowledgebaseLinks"

const TBTCBridge: PageComponent = () => {
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { depositKey } = useParams()

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

  const isDepositDetailsPageActive = !!depositKey

  return (
    <PageLayout
      backgroundVariant={isDepositDetailsPageActive ? "secondary" : "primary"}
      renderTop={<h1>TODO: My balance component</h1>}
      renderLeft={isDepositDetailsPageActive ? <MintingTimeline /> : null}
      renderRight={
        isDepositDetailsPageActive ? (
          <KnowledgebaseLinks depositKey={depositKey} />
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
