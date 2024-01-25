import { Box, BoxProps, Flex } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FC } from "react"
import { ModalType, Token } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { useToken } from "../../hooks/useToken"
import { Logo } from "../Logo"
import { NavigationMenu } from "./NavigationMenu"
import { UserPanel } from "./UserPanel"

// TODO: Load new fonts

const Header: FC<BoxProps> = (props) => {
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
      borderColor={"whiteAlpha.350"}
      {...props}
    >
      <Flex
        maxW={"1920px"}
        mx={"auto"}
        alignItems={"center"}
        px={{ base: 2, lg: 10 }}
        h={{ base: 16, lg: 24 }}
      >
        <Logo zIndex="popover" />
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