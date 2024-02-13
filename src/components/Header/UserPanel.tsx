import {
  As,
  BodyMd,
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  StackProps,
} from "@threshold-network/components"
import { FC } from "react"
import { FaCogs as TestnetIcon } from "react-icons/fa"
import { HiOutlinePlus as PlusIcon } from "react-icons/hi"
import { ChainID } from "../../enums"
import { EthereumDark } from "../../static/icons/EthereumDark"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { InlineTokenBalance } from "../TokenBalance"

const networkIconMap = new Map<ChainID, As<unknown>>([
  [ChainID.Ethereum, EthereumDark],
  [ChainID.Goerli, TestnetIcon],
])

interface UserPanelProps extends StackProps {
  /** Whether the user is connected to a wallet */
  isConnected: boolean
  /** The address of the connected wallet */
  accountAddress?: Nullable<string>
  /** The balance of the connected wallet */
  balance: number | string
  /** The identifier of the chain */
  chainId?: Nullable<number>
  /** The callback to invoke when the user clicks the disconnect button */
  onDisconnectClick: () => void
  /** The callback to invoke when the user clicks the connect button */
  onConnectClick: () => void
}

export const UserPanel: FC<UserPanelProps> = ({
  isConnected,
  accountAddress,
  balance,
  chainId,
  onDisconnectClick,
  onConnectClick,
  ...restProps
}) => {
  return (
    <HStack
      spacing={{ base: 0, md: 6 }}
      alignSelf={"stretch"}
      ml="auto"
      {...restProps}
    >
      {isConnected && !!accountAddress && !!chainId ? (
        <>
          <Box as="p">
            <InlineTokenBalance
              fontWeight="medium"
              tokenAmount={balance}
              color="hsla(0, 0%, 100%, 90%)"
            />
            &nbsp;
            <BodyMd as="span" color="hsla(0, 0%, 100%, 50%)">
              tBTC
            </BodyMd>
          </Box>
          <HStack spacing={3}>
            <Button
              display={{ base: "none", md: "flex" }}
              size="sm"
              variant="outline"
              color="white"
              leftIcon={<Icon as={networkIconMap.get(chainId)} />}
            >
              {chainIdToNetworkName(chainId)}
            </Button>
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                size="sm"
                variant="outline"
                leftIcon={<Identicon address={accountAddress} />}
              >
                {shortenAddress(accountAddress)}
              </MenuButton>
              <MenuList
                bgGradient="radial(circle at bottom right, #0A1616, #090909)"
                border="1px solid"
                borderColor="whiteAlpha.250"
                rounded="lg"
              >
                <MenuItem
                  onClick={onDisconnectClick}
                  _hover={{
                    bg: "whiteAlpha.100",
                  }}
                  _active={{
                    bg: "whiteAlpha.200",
                  }}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </>
      ) : (
        <Button
          variant="outline"
          leftIcon={<PlusIcon />}
          onClick={onConnectClick}
          size="sm"
        >
          Connect Wallet
        </Button>
      )}
    </HStack>
  )
}
