import { useWeb3React } from "@web3-react/core"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { Taho } from "../../../static/icons/Taho"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import InitialWalletSelection from "./InitialSelection"
import { FC, useState } from "react"
import ConnectMetamask from "./ConnectMetamask"
import withBaseModal from "../withBaseModal"
import ConnectWalletConnect from "./ConnectWalletConnect"
import { WalletType } from "../../../enums"
import { BaseModalProps, WalletOption } from "../../../types"
import ConnectCoinbase from "./ConnectCoinbase"
import { CoinbaseWallet } from "../../../static/icons/CoinbaseWallet"
import { useModal } from "../../../hooks/useModal"
import ConnectTaho from "./ConnectTaho"
import ConnectLedgerLive from "./ConnectLedgerLive"
import { LedgerLight } from "../../../static/icons/LedgerLight"
import { LedgerDark } from "../../../static/icons/LedgerDark"
import { featureFlags } from "../../../constants"

const walletOptions: WalletOption[] = [
  {
    id: WalletType.TAHO,
    title: "Taho",
    icon: {
      light: Taho,
      dark: Taho,
    },
  },
  {
    id: WalletType.Metamask,
    title: "MetaMask",
    icon: {
      light: MetaMaskIcon,
      dark: MetaMaskIcon,
    },
  },
  ...(featureFlags.LEDGER_LIVE
    ? [
        {
          id: WalletType.LedgerLive,
          title: "Ledger Live",
          icon: {
            light: LedgerLight,
            dark: LedgerDark,
          },
        },
      ]
    : []),
  {
    id: WalletType.WalletConnect,
    title: "WalletConnect",
    icon: {
      light: WalletConnectIcon,
      dark: WalletConnectIcon,
    },
  },
  {
    id: WalletType.Coinbase,
    title: "Coinbase Wallet",
    icon: {
      light: CoinbaseWallet,
      dark: CoinbaseWallet,
    },
  },
]

const SelectWalletModal: FC<BaseModalProps> = () => {
  const { deactivate } = useWeb3React()
  const { closeModal } = useModal()

  const [walletToConnect, setWalletToConnect] = useState<WalletType | null>(
    null
  )

  const goBack = () => {
    deactivate()
    setWalletToConnect(null)
  }

  const onClick = async (walletType: WalletType) => {
    setWalletToConnect(walletType)
  }

  return walletToConnect === null ? (
    <InitialWalletSelection walletOptions={walletOptions} onSelect={onClick} />
  ) : (
    <ConnectWallet
      walletType={walletToConnect}
      goBack={goBack}
      onClose={closeModal}
    />
  )
}

const ConnectWallet: FC<{
  walletType: WalletType
  goBack: () => void
  onClose: () => void
}> = ({ walletType, goBack, onClose }) => {
  switch (walletType) {
    case WalletType.TAHO:
      return <ConnectTaho goBack={goBack} closeModal={onClose} />
    case WalletType.Metamask:
      return <ConnectMetamask goBack={goBack} closeModal={onClose} />
    case WalletType.WalletConnect:
      return <ConnectWalletConnect goBack={goBack} closeModal={onClose} />
    case WalletType.Coinbase:
      return <ConnectCoinbase goBack={goBack} closeModal={onClose} />
    case WalletType.LedgerLive:
      return <ConnectLedgerLive goBack={goBack} closeModal={onClose} />
    default:
      return <></>
  }
}

export default withBaseModal(SelectWalletModal, "Connect a Wallet")
