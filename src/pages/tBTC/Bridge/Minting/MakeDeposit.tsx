import {
  BodyLg,
  BodyMd,
  BodySm,
  Box,
  Button,
  Card,
  ChecklistGroup,
  Divider,
  HStack,
  Stack,
  useColorModeValue,
  VStack,
} from "@threshold-network/components"
import { ComponentProps, FC } from "react"
import {
  CopyAddressToClipboard,
  CopyToClipboard,
  CopyToClipboardButton,
} from "../../../../components/CopyToClipboard"
import { QRCode } from "../../../../components/QRCode"
import TooltipIcon from "../../../../components/TooltipIcon"
import { ViewInBlockExplorerProps } from "../../../../components/ViewInBlockExplorer"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BridgeProcessTitle } from "../components/BridgeProcessTitle"

const AddressRow: FC<
  { address: string; text: string } & Pick<ViewInBlockExplorerProps, "chain">
> = ({ address, text, chain }) => {
  return (
    <HStack justify="space-between">
      <BodySm
        bg="hsla(182, 100%, 70%, 10%)"
        color="hsl(182, 50%, 70%)"
        px="2"
        rounded="sm"
      >
        {text}
      </BodySm>
      <CopyAddressToClipboard
        address={address}
        copyButtonPosition="end"
        withLinkToBlockExplorer
        chain={chain}
      />
    </HStack>
  )
}

const BTCAddressCard: FC<ComponentProps<typeof Card>> = ({
  children,
  ...restProps
}) => {
  return (
    <Card
      {...restProps}
      borderColor={"hsla(0, 0%, 100%, 10%)"}
      bg={"hsla(0, 0%, 0%, 30%)"}
    >
      {children}
    </Card>
  )
}

const BTCAddressSection: FC<{ btcDepositAddress: string }> = ({
  btcDepositAddress,
}) => {
  const titleColor = useColorModeValue("gray.700", "gray.100")
  const btcAddressColor = useColorModeValue("brand.500", "white")

  return (
    <Box>
      <BodyLg color={titleColor}>BTC Deposit Address</BodyLg>
      <BTCAddressCard p="2.5" display="flex" justifyContent="center">
        <Box
          p={2.5}
          backgroundColor={"white"}
          width={"100%"}
          maxW="205px"
          borderRadius="8px"
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={btcDepositAddress}
            viewBox={`0 0 256 256`}
          />
        </Box>
      </BTCAddressCard>
      <CopyToClipboard textToCopy={btcDepositAddress}>
        <HStack mt="2.5">
          <BTCAddressCard minW="0" p="2">
            <BodyMd color={btcAddressColor} textStyle="chain-identifier">
              {btcDepositAddress}
            </BodyMd>
          </BTCAddressCard>
          <BTCAddressCard
            flex="1"
            p="4"
            display="flex"
            alignSelf="stretch"
            alignItems="center"
          >
            <CopyToClipboardButton />
          </BTCAddressCard>
        </HStack>
      </CopyToClipboard>
    </Box>
  )
}

const MakeDepositComponent: FC = () => {
  const { btcDepositAddress, ethAddress, btcRecoveryAddress, updateState } =
    useTbtcState()

  return (
    <>
      <BridgeProcessTitle />
      <VStack align="stretch" spacing="10" px="20" my="10">
        <VStack spacing="2">
          <BodyMd>
            Use this generated address to send minimum 0.01&nbsp;BTC, to mint as
            tBTC.
          </BodyMd>
          <BodyMd>
            This address is a uniquely generated address based on the data you
            provided.
          </BodyMd>
        </VStack>
        <BTCAddressSection btcDepositAddress={btcDepositAddress} />
        <Stack spacing={4} mt="5">
          <BodyMd>Provided Addresses Recap</BodyMd>
          <AddressRow text="ETH Address" address={ethAddress} />
          <AddressRow
            text="BTC Recovery Address"
            address={btcRecoveryAddress}
            chain="bitcoin"
          />
        </Stack>
        <Divider mt={4} />
        <ChecklistGroup
          checklistItems={[
            {
              itemId: "staking_deposit__0",
              itemTitle: "",
              itemSubTitle: (
                <BodyMd color={useColorModeValue("gray.500", "gray.300")}>
                  Send the funds and come back to this dApp. You do not need to
                  wait for the BTC transaction to be mined.
                </BodyMd>
              ),
            },
          ]}
        />
        {/* TODO: No need to use button here. We can replace it with just some text */}
        <Button
          isLoading={true}
          loadingText={"Waiting for funds to be sent..."}
          form="tbtc-minting-data-form"
          isDisabled={true}
          isFullWidth
        >
          I sent the BTC
        </Button>
      </VStack>
    </>
  )
}

export const MakeDeposit = withOnlyConnectedWallet(MakeDepositComponent)
