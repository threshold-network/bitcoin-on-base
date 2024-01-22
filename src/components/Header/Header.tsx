import { Box, BoxProps, Flex } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { FC } from "react"
import { ModalType, Token } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { useToken } from "../../hooks/useToken"
import { Logo } from "../Logo"
import { NavigationMenu, UserPanel } from "./Header.children"

// TODO: Load new fonts

export interface HeaderProps extends BoxProps {}

const Header: FC<HeaderProps> = (props) => {
  const {
    active: isConnected,
    deactivate: handleWalletDisconnection,
    account: accountAddress,
    chainId,
  } = useWeb3React()
  const { openModal } = useModal()
  const handleWalletConnection = () => openModal(ModalType.SelectWallet)
  const { balance } = useToken(Token.TBTCV2)

  return (
    <Box
      bg={"black"}
      color={"white"}
      borderBottom={"1px solid"}
      borderColor={"border.100"}
      {...props}
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
          balance={balance}
          chainId={chainId}
          onConnectClick={handleWalletConnection}
          onDisconnectClick={handleWalletDisconnection}
        />
      </Flex>
    </Box>
  )
}

export default Header
