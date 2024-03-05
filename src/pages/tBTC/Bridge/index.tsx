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
import { MintingDepositTimeline } from "./Minting/MintingDepositTimeline"
import { useParams } from "react-router"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { KnowledgeBaseLinks } from "./Minting/KnowledgeBaseLinks"

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
      backgroundVariant="secondary"
      renderTop={<TbtcBalanceCard />}
      renderLeft={<MintingDepositTimeline title="Minting timeline" />}
      renderRight={
        isDepositDetailsPageActive ? (
          <KnowledgeBaseLinks depositKey={depositKey} />
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
