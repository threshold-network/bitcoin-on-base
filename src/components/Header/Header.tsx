import { Box, Flex } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { Logo } from "../Logo"
import { NavigationMenu, UserPanel } from "./Header.children"

// TODO: Load new fonts

function Header() {
  const {
    active: isConnected,
    deactivate: handleWalletDisconnection,
    account: accountAddress,
    chainId,
  } = useWeb3React()
  const { openModal } = useModal()
  const handleWalletConnection = () => openModal(ModalType.SelectWallet)

  return (
    <Box
      bg={"black"}
      color={"white"}
      borderBottom={"1px solid"}
      borderColor={"border.100"}
    >
      <Flex maxW={"1920px"} mx={"auto"} alignItems={"center"} px={10} h={24}>
        <Logo />
        <NavigationMenu
          items={[
            { label: "Bridge", to: "/tBTC/mint" },
            { label: "Collect", to: "/collect" },
            { label: "Earn", to: "/earn" },
          ]}
        />
        <UserPanel
          isConnected={isConnected}
          accountAddress={accountAddress}
          balance={BigNumber.from("53221000000000000000").toString()} //TODO: Get balance from the account data
          chainId={chainId}
          onConnectClick={handleWalletConnection}
          onDisconnectClick={handleWalletDisconnection}
        />
      </Flex>
    </Box>
  )
}

export default Header
