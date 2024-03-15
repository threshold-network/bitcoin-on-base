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
  const { account, active } = useWeb3React()
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

  return (
    <PageLayout
      backgroundVariant="secondary"
      renderTop={active ? <TbtcBalanceCard /> : undefined}
      renderLeft={
        active || depositKey ? (
          <MintingDepositTimeline title="Minting timeline" />
        ) : undefined
      }
      renderRight={
        <>
          {!(active || depositKey) && (
            <MintingDepositTimeline
              title="Minting timeline"
              mb={{ base: 6, md: "92px" }}
            />
          )}
          <KnowledgeBaseLinks depositKey={depositKey} />
        </>
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
