import {
  BodyMd,
  Box,
  Button,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import React, { FC, useEffect } from "react"
import {
  HiCheckCircle as CheckIcon,
  HiChevronLeft as ChevronLeftIcon,
  HiInformationCircle as InfoIcon,
} from "react-icons/hi"
import { WalletType } from "../../../../enums"
import { useCapture } from "../../../../hooks/posthog"
import { BaseModalProps } from "../../../../types"
import { PosthogEvent } from "../../../../types/posthog"
import shortenAddress from "../../../../utils/shortenAddress"
import { AbstractConnector } from "../../../../web3/connectors"

const getStatusMessage = (error?: Error, account?: Nullable<string>) => {
  if (account) {
    return `Address: ${shortenAddress(account)}`
  }
  if (!!error) {
    return "Wallet not found."
  }
  return "The wallet will open in an external window."
}
interface Props extends BaseModalProps {
  WalletIcon: any
  title: string
  tryAgain?: () => void
  onContinue?: () => void
  goBack: () => void
  connector?: AbstractConnector
  walletType: WalletType
  /**
   * This is required for some of the providers (for example WalletConnect v2),
   * because they have their own modal that is being opened. In that case we
   * can't display our loading modal because it has larger z-index than
   * provider's one and it's too problematic to change that.
   *
   */
  shouldForceCloseModal?: boolean
}

const WalletConnectionModalBase: FC<Props> = ({
  goBack,
  closeModal,
  WalletIcon,
  title,
  children,
  tryAgain,
  onContinue,
  connector,
  walletType,
  shouldForceCloseModal,
}) => {
  const { activate, active, account, error } = useWeb3React()
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)

  useEffect(() => {
    if (!connector) return

    captureWalletConnected({ walletType })
    activate(connector)
    if (shouldForceCloseModal) closeModal()
  }, [
    activate,
    connector,
    captureWalletConnected,
    walletType,
    shouldForceCloseModal,
  ])

  return (
    <>
      <ModalBody p={0}>
        <Box p={6}>{children}</Box>
        <VStack spacing={6} borderY="1px solid" borderColor="whiteAlpha.250">
          <HStack p={6} spacing={6} align="start" w="full">
            {React.isValidElement(WalletIcon) ? (
              WalletIcon
            ) : (
              <Icon as={WalletIcon} h={7} w={7} />
            )}
            <VStack align="start">
              <Text fontSize="xl">{title}</Text>
              <HStack spacing={2} align="center" color="whiteAlpha.600">
                <Icon
                  as={!!account ? CheckIcon : InfoIcon}
                  color={account ? "#66FFB6" : "currentColor"}
                  w={6}
                  h={6}
                />
                <BodyMd color="currentColor" lineHeight={6}>
                  {getStatusMessage(error, account)}
                </BodyMd>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </ModalBody>
      <ModalFooter as={HStack} justify="space-between" p={6}>
        <Button
          variant="outline"
          leftIcon={<Icon as={ChevronLeftIcon} w={5} h={5} />}
          onClick={goBack}
          mr="auto"
          size="sm"
        >
          Change Wallet
        </Button>

        {tryAgain && !active && (
          <Button ml={4} onClick={tryAgain} size="sm">
            Try Again
          </Button>
        )}

        {active && account && (
          <Button ml={4} onClick={closeModal} size="sm">
            View Dashboard
          </Button>
        )}

        {onContinue && (
          <Button ml={4} onClick={onContinue} size="sm">
            Continue
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

export default WalletConnectionModalBase
