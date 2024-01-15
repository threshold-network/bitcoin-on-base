import "focus-visible/dist/focus-visible"
import "@fontsource/inter/700.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/400.css"
import "@fontsource/ibm-plex-mono/400.css"
import { FC, useEffect, Fragment } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { Provider as ReduxProvider, useDispatch } from "react-redux"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import { ConnectorEvent, ConnectorUpdate } from "@web3-react/types"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom"
import { TokenContextProvider } from "./contexts/TokenContext"
import theme from "./theme"
import reduxStore, { resetStoreAction } from "./store"
import ModalRoot from "./components/Modal"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import { fetchETHPriceUSD } from "./store/eth"
import { PageComponent } from "./types"
import { Token } from "./enums"
import getLibrary from "./web3/library"
import { useSubscribeToERC20TransferEvent } from "./web3/hooks/useSubscribeToERC20TransferEvent"
import { pages } from "./pages"
import { isSameETHAddress } from "./web3/utils"
import { ThresholdProvider } from "./contexts/ThresholdContext"
import { useSaveConnectedAddressToStore } from "./hooks/useSaveConnectedAddressToStore"
import { usePosthog } from "./hooks/posthog"
import { useSubscribeToDepositRevealedEvent } from "./hooks/tbtc/useSubsribeToDepositRevealedEvent"
import {
  useSubscribeToOptimisticMintingFinalizedEvent,
  useSubscribeToOptimisticMintingRequestedEvent,
  useSubscribeToRedemptionRequestedEvent,
} from "./hooks/tbtc"
import { useSentry } from "./hooks/sentry"

const Web3EventHandlerComponent = () => {
  useSubscribeToERC20TransferEvent(Token.TBTCV2)
  useSubscribeToDepositRevealedEvent()
  useSubscribeToOptimisticMintingFinalizedEvent()
  useSubscribeToOptimisticMintingRequestedEvent()
  useSubscribeToRedemptionRequestedEvent()

  return <></>
}

const AppBody = () => {
  const dispatch = useDispatch()
  const { connector, account, deactivate } = useWeb3React()

  useEffect(() => {
    const updateHandler = (update: ConnectorUpdate) => {
      // if chain is changed then just deactivate the current provider and reset
      // store
      if (update.chainId) {
        dispatch(resetStoreAction())
        deactivate()
      } else if (
        !update.account ||
        !isSameETHAddress(update.account, account as string)
      ) {
        // dispatch(resetStoreAction())

        // TODO: This is a workaround for the accounts change. There are some
        // unecpecting errors happening when the user changes the account in
        // MM while he is connected to the dApp. To avoid any potential issues
        // we are refreshing the page when we notice that the account was
        // changed.
        // The refresh will not fire if the uer disconnects and reconnects with
        // another wallet or if he connects the wallet for the first time.
        window.location.reload()
      }
    }

    const deactivateHandler = () => {
      dispatch(resetStoreAction())
    }

    connector?.on(ConnectorEvent.Update, updateHandler)
    connector?.on(ConnectorEvent.Deactivate, deactivateHandler)
    return () => {
      connector?.removeListener(ConnectorEvent.Update, updateHandler)
      connector?.removeListener(ConnectorEvent.Deactivate, deactivateHandler)
    }
  }, [connector, dispatch, account])

  usePosthog()
  useSaveConnectedAddressToStore()
  useSentry()

  return <Routing />
}

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Outlet />}>
        <Route index element={<Navigate to="tBTC" />} />
        {pages.map(renderPageComponent)}
        <Route path="*" element={<Navigate to="tBTC" />} />
      </Route>
    </Routes>
  )
}

const renderPageComponent = (PageComponent: PageComponent) => {
  if (!PageComponent.route.isPageEnabled) return null
  const { parentPathBase: parentPathBaseFromRoute } = PageComponent.route
  const parentPathBase = parentPathBaseFromRoute || ""
  const updatedParentPathBase = PageComponent.route.path
    ? `${parentPathBase}/${PageComponent.route.path}`
    : parentPathBase

  return (
    <Fragment key={PageComponent.route.path}>
      {PageComponent.route.index && (
        <Route
          index
          element={<Navigate to={PageComponent.route.path} replace />}
        />
      )}
      <Route
        path={PageComponent.route.path}
        element={
          <PageComponent
            {...PageComponent.route}
            parentPathBase={updatedParentPathBase}
          />
        }
      >
        {PageComponent.route.pages?.map((page) => {
          page.route.parentPathBase = updatedParentPathBase
          return renderPageComponent(page)
        })}
      </Route>
    </Fragment>
  )
}

const App: FC = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThresholdProvider>
          <ReduxProvider store={reduxStore}>
            <ChakraProvider theme={theme}>
              <TokenContextProvider>
                <Web3EventHandlerComponent />
                <ModalRoot />
                <AppBody />
              </TokenContextProvider>
            </ChakraProvider>
          </ReduxProvider>
        </ThresholdProvider>
      </Web3ReactProvider>
    </Router>
  )
}

export default App
