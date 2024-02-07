import { Badge, Button, Checkbox, Icon, Text, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FC, Ref, useRef, useState } from "react"
import { HiChevronRight as ChevronRightIcon } from "react-icons/hi"
import { Form, FormikInput } from "../../../../components/Forms"
import TooltipIcon from "../../../../components/TooltipIcon"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { MintingStep } from "../../../../types/tbtc"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { supportedChainId } from "../../../../utils/getEnvVariable"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import { downloadFile, isSameETHAddress } from "../../../../web3/utils"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
}

type ComponentProps = {
  formId: string
}

const resolvedBTCAddressPrefix = getBridgeBTCSupportedAddressPrefixesText(
  "mint",
  supportedChainId === "1" ? BitcoinNetwork.Mainnet : BitcoinNetwork.Testnet
)

const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <VStack as={Form} spacing={8} id={formId}>
      <FormikInput
        name="ethAddress"
        label="BASE Address"
        placeholder="Address where you'll receive your tBTC"
        tooltip="
          ETH address is prepopulated with your wallet address. This is the 
          address where you'll receive your tBTC.
        "
        isReadOnly={true}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip={`
          This address needs to start with ${resolvedBTCAddressPrefix}. 
          Recovery Address is a BTC address where your BTC funds are sent back
          if something exceptional happens with your deposit. A Recovery 
          Address cannot be a multi-sig or an exchange address. Funds claiming
          is done by using the JSON file
        `}
        placeholder={`BTC Address should start with ${resolvedBTCAddressPrefix}`}
      />
    </VStack>
  )
}

type MintingProcessFormProps = {
  initialEthAddress: string
  btcRecoveryAddress: string
  bitcoinNetwork: BitcoinNetwork
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({
    initialEthAddress,
    btcRecoveryAddress,
    bitcoinNetwork,
  }) => ({
    ethAddress: initialEthAddress,
    btcRecoveryAddress: btcRecoveryAddress,
    bitcoinNetwork: bitcoinNetwork,
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    errors.btcRecoveryAddress = validateBTCAddress(
      values.btcRecoveryAddress,
      values.bitcoinNetwork as any
    )
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
  enableReinitialize: true,
})(MintingProcessFormBase)

export const ProvideDataComponent: FC = () => {
  const { updateState } = useTbtcState()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)
  const formRef = useRef<FormikProps<FormValues>>(null)
  const threshold = useThreshold()
  const { account } = useWeb3React()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)
  const [shouldDownloadDepositReceipt, setShouldDownloadDepositReceipt] =
    useState(true)

  const handleDepositReceiptAgreementChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const {
      target: { checked },
    } = event
    setShouldDownloadDepositReceipt(checked)
  }

  const onSubmit = async (values: FormValues) => {
    if (account && !isSameETHAddress(values.ethAddress, account)) {
      throw new Error(
        "The account used to generate the deposit address must be the same as the connected wallet."
      )
    }
    setSubmitButtonLoading(true)
    const deposit = await threshold.tbtc.initiateDeposit(
      values.btcRecoveryAddress
    )
    const depositAddress = await threshold.tbtc.calculateDepositAddress()
    const receipt = deposit.getReceipt()

    // update state,
    updateState("ethAddress", values.ethAddress)
    updateState("blindingFactor", receipt.blindingFactor.toString())
    updateState("btcRecoveryAddress", values.btcRecoveryAddress)
    updateState("walletPublicKeyHash", receipt.walletPublicKeyHash.toString())
    updateState("refundLocktime", receipt.refundLocktime.toString())

    // create a new deposit address,
    updateState("btcDepositAddress", depositAddress)

    setDepositDataInLocalStorage({
      ethAddress: values.ethAddress,
      blindingFactor: receipt.blindingFactor.toString(),
      btcRecoveryAddress: values.btcRecoveryAddress,
      walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
      refundLocktime: receipt.refundLocktime.toString(),
      btcDepositAddress: depositAddress,
    })

    depositTelemetry(receipt, depositAddress)

    if (shouldDownloadDepositReceipt) {
      const date = new Date().toISOString().split("T")[0]

      const fileName = `${values.ethAddress}_${depositAddress}_${date}.json`

      const finalData = {
        depositor: {
          identifierHex: receipt.depositor.identifierHex.toString(),
        },
        refundLocktime: receipt.refundLocktime.toString(),
        refundPublicKeyHash: receipt.refundPublicKeyHash.toString(),
        blindingFactor: receipt.blindingFactor.toString(),
        ethAddress: values.ethAddress,
        walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
        btcRecoveryAddress: values.btcRecoveryAddress,
      }
      downloadFile(JSON.stringify(finalData), fileName, "text/json")
    }

    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <VStack mx={{ base: 0, lg: 10 }} align="stretch" spacing={8}>
      <BridgeProcessCardTitle
        number={1}
        title="Deposit Address"
        description="
          Based on these two addresses, the system will generate for you a 
          unique BTC deposit address. There is no minting limit.
        "
        afterDescription={<Badge variant="subtle">Action OFF-Chain</Badge>}
      />
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress={account!}
        btcRecoveryAddress={""}
        bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
        onSubmitForm={onSubmit}
      />
      <Checkbox defaultChecked onChange={handleDepositReceiptAgreementChange}>
        Download Deposit Receipt&nbsp;
        <Text as="span" color="#888">
          (Recommended)
        </Text>
        <TooltipIcon
          color="#888"
          label="
            The file is extremely important in case you need to make a fast 
            recovery. This file is important in the rare case of fund recovery.
            Keep it until you have received your tBTC token. One deposit, one 
            receipt. This file contains a BTC recovery address, a wallet public 
            key, a refund public key and a refund lock time of your deposit.
          "
          ml={3}
        />
      </Checkbox>
      <Button
        isLoading={isSubmitButtonLoading}
        loadingText={"Generating Deposit Address..."}
        type="submit"
        form="tbtc-minting-data-form"
        isFullWidth
        data-ph-capture-attribute-button-name={`Generate Deposit Address (Deposit flow)`}
        iconSpacing={2.5}
        rightIcon={<Icon as={ChevronRightIcon} w={5} h={5} />}
      >
        Generate Deposit Address
      </Button>
      <Text
        fontSize="sm"
        lineHeight={6}
        color="hsl(0, 0%, 50%)"
        textAlign="center"
      >
        tBTC is a 1-1 representation of Bitcoin on Base. You can revert anytime.
      </Text>
    </VStack>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
