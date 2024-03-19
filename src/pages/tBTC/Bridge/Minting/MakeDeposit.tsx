import { FC } from "react"
import {
  BodySm,
  BodyMd,
  Box,
  Button,
  HStack,
  Stack,
  VStack,
  useClipboard,
  Icon,
  Text,
  Badge,
  StackProps,
} from "@threshold-network/components"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import TooltipIcon from "../../../../components/TooltipIcon"
import { CopyAddressToClipboard } from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { QRCode } from "../../../../components/QRCode"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { ViewInBlockExplorerProps } from "../../../../components/ViewInBlockExplorer"
import { Copy as CopyIcon } from "../../../../static/icons/Copy"
import { MintDurationTiers } from "../../../../components/MintDurationTiers"
import { Toast } from "../../../../components/Toast"
import { Hourglass as HourglassIcon } from "../../../../static/icons/Hourglass"

const AddressRow: FC<
  { address: string; text: string } & Pick<ViewInBlockExplorerProps, "chain">
> = ({ address, text, chain }) => {
  return (
    <HStack
      justify="space-between"
      rounded="2xl"
      boxShadow="2xl"
      bg="#0D0D0D"
      border="1px solid hsla(0, 0%, 20%, 40%)"
      px={4}
      py={2.5}
      spacing={6}
    >
      <BodyMd color="hsla(0, 0%, 100%, 50%)">{text}</BodyMd>
      <CopyAddressToClipboard
        address={address}
        copyButtonPosition="end"
        chain={chain}
      />
    </HStack>
  )
}

const BTCAddressSection: FC<{ btcDepositAddress: string } & StackProps> = ({
  btcDepositAddress,
  ...restProps
}) => {
  const { onCopy: handleCopy, hasCopied } = useClipboard(btcDepositAddress)

  return (
    <VStack spacing="2" align="start" {...restProps}>
      <HStack
        alignItems="center"
        // To center the tooltip icon. The tooltip icon is wrapped by `span`
        // because of: If you're wrapping an icon from `react-icons`, you need
        // to also wrap the icon in a `span` element as `react-icons` icons do
        // not use forwardRef. See
        // https://chakra-ui.com/docs/components/tooltip#with-an-icon.
        sx={{ ">span": { display: "flex" } }}
      >
        <BodySm fontWeight="medium" color="brand.100" lineHeight={1.5}>
          BTC Deposit Address
        </BodySm>
        <TooltipIcon label="This is a unique BTC address generated based on the ETH address and Recovery address you provided. Send your BTC funds to this address in order to mint tBTC." />
      </HStack>
      <Stack
        w="full"
        direction={{ base: "column", sm: "row" }}
        align="start"
        py={4}
        pl={4}
        pr={10}
        spacing={10}
        rounded="2xl"
        border="1px solid #333"
      >
        <Box p={3.5} rounded="xl" bg="brand.100">
          <QRCode
            size={180}
            value={btcDepositAddress}
            viewBox="0 0 180 180"
            bgColor="transparent"
          />
        </Box>
        <VStack spacing={6} align="start">
          <BodyMd color="brand.100" overflowWrap="anywhere">
            {btcDepositAddress}
          </BodyMd>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            color="white"
            textTransform="capitalize"
            rightIcon={<Icon as={CopyIcon} color="brand.100" />}
          >
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </VStack>
      </Stack>
    </VStack>
  )
}

const MakeDepositComponent: FC<{
  onPreviousStepClick: (previousStep?: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { btcDepositAddress, ethAddress, btcRecoveryAddress, updateState } =
    useTbtcState()

  return (
    <>
      <Toast
        status="info"
        icon={HourglassIcon}
        title="Waiting for your deposit"
        description="The system is continuously checking for your BTC deposits"
        isDismissable={false}
      />
      <Box mx={{ base: 0, xl: 10 }}>
        <BridgeProcessCardTitle
          onPreviousStepClick={onPreviousStepClick}
          badgeText="2/3"
          title="Make your BTC deposit"
          description={
            <>
              Use this generated address to send minimum{" "}
              <Text as="span" color="white">
                0.01&nbsp;BTC
              </Text>
              , to mint as tBTC. This address is a uniquely generated address
              based on the data you provided.
            </>
          }
          afterDescription={
            <Badge variant="subtle" color="hsl(33, 93%, 54%)">
              Action on Bitcoin
            </Badge>
          }
        />
        <BTCAddressSection mt={6} btcDepositAddress={btcDepositAddress} />
        <MintDurationTiers
          mt={6}
          items={[
            {
              amount: 0.1,
              rangeOperator: "less",
              currency: "BTC",
            },
            {
              amount: 1,
              rangeOperator: "less",
              currency: "BTC",
            },
            {
              amount: 1,
              rangeOperator: "greaterOrEqual",
              currency: "BTC",
            },
          ]}
        />
        <Stack spacing={2} mt={6}>
          <BodySm fontWeight="medium" color="brand.100" lineHeight={1.5}>
            Provided Addresses Recap
          </BodySm>
          <AddressRow text="Base address" address={ethAddress} />
          <AddressRow
            text="BTC Recovery address"
            address={btcRecoveryAddress}
            chain="bitcoin"
          />
        </Stack>
      </Box>
    </>
  )
}

export const MakeDeposit = withOnlyConnectedWallet(MakeDepositComponent)
