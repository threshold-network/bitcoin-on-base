import { useEffect } from "react"
import { MintingStep, PageComponent } from "../../../types"
import { useModal } from "../../../hooks/useModal"
import { ExternalHref, ModalType } from "../../../enums"
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
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TimeIcon } from "@chakra-ui/icons"
import {
  LabelSm,
  BodySm,
  Flex,
  Badge,
  Icon,
  List,
  ListItem,
} from "@threshold-network/components"
import { BridgeProcessIndicator } from "../../../components/tBTC"
import ViewInBlockExplorer, {
  Chain,
} from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import {
  BridgeProcessResource,
  BridgeProcessResourceProps,
} from "./components/BridgeProcessResource"

const TBTCBridge: PageComponent = (props) => {
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const { mintingStep } = useTbtcState()

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

  const shouldRenderSidebars =
    pathname.startsWith("/tBTC/mint/deposit") ||
    mintingStep !== MintingStep.ProvideData

  return (
    <PageLayout
      renderTop={<TbtcBalanceCard />}
      renderLeft={shouldRenderSidebars ? <MintingTimeline /> : null}
      renderRight={
        shouldRenderSidebars ? (
          <Flex direction="column">
            <LabelSm mb="8" mt={{ xl: 2 }}>
              Transaction History
            </LabelSm>
            <Badge
              size="sm"
              colorScheme="yellow"
              variant="solid"
              display="flex"
              alignItems="center"
              alignSelf="flex-start"
              mb="4"
            >
              <Icon as={TimeIcon} /> ~3 hours minting time
            </Badge>
            <List color="gray.500" spacing="2" mb="20">
              {transactions
                .filter((item) => !!item.txHash)
                .map((item) => (
                  <ListItem key={item.txHash}>
                    <BodySm>
                      {item.label}{" "}
                      <ViewInBlockExplorer
                        id={item.txHash!}
                        type={ExplorerDataType.TRANSACTION}
                        chain={item.chain}
                        text="transaction"
                      />
                      .
                    </BodySm>
                  </ListItem>
                ))}
            </List>

            <BridgeProcessResource
              {...stepToResourceData["bitcoin-confirmations"]}
            />
          </Flex>
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

type DepositDetailsTimelineStep =
  | "bitcoin-confirmations"
  | "minting-initialized"
  | "guardian-check"
  | "minting-completed"
  | "completed"
const stepToResourceData: Record<
  Exclude<DepositDetailsTimelineStep, "completed">,
  BridgeProcessResourceProps
> = {
  "bitcoin-confirmations": {
    title: "Bitcoin Confirmations Requirement",
    subtitle:
      "Confirmations typically ensure transaction validity and finality.",
    link: ExternalHref.btcConfirmations,
  },
  "minting-initialized": {
    title: "Minters, Guardians and a secure tBTC",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "guardian-check": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
  "minting-completed": {
    title: "Minters and Guardians in Optimistic Minting",
    subtitle: "A phased approach with two main roles: Minters and Guardians.",
    link: ExternalHref.mintersAndGuardiansDocs,
  },
}

const transactions: {
  label: string
  txHash?: string
  chain: Chain
}[] = [
  { label: "Bitcoin Deposit", txHash: "0x1234", chain: "bitcoin" },
  { label: "Reveal", txHash: "0x1234", chain: "ethereum" },
  {
    label: "Minting Initiation",
    txHash: "0x1234",
    chain: "ethereum",
  },
  {
    label: "Minting completion",
    txHash: "0x1234",
    chain: "ethereum",
  },
]
