import { FC, Ref, useCallback, useRef, useState } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { Button, VStack, BodyMd, Checkbox } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { BridgeProcessTitle } from "../components/BridgeProcessTitle"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { MintingStep } from "../../../../types/tbtc"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { useWeb3React } from "@web3-react/core"
import { BitcoinNetwork } from "../../../../threshold-ts/types"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { downloadFile, isSameETHAddress } from "../../../../web3/utils"
import { supportedChainId } from "../../../../utils/getEnvVariable"
import { getBridgeBTCSupportedAddressPrefixesText } from "../../../../utils/tBTC"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import TransactionInfoTable from "../../../../components/TransactionInfoTable"

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
    <VStack as={Form} id={formId} spacing="6">
      <FormikInput
        name="ethAddress"
        label="Base Address"
        // TODO: Update placeholder and tooltip (???) copies
        placeholder="Address where you'll receive your tBTC"
        isReadOnly={true}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        // TODO: Update placeholder and tooltip (???) copies
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

const mockTransactionInfo = [
  // TODO: Update mocked values
  {
    text: "Network fee",
    value: { tokenAmount: 1, withSymbol: true, tokenSymbol: "BTC" },
  },
  {
    text: "Minting fee",
    value: {
      tokenAmount: 1,
      isEstimated: true,
      withSymbol: true,
      tokenSymbol: "BTC",
    },
  },
  {
    text: "You will receive",
    value: { tokenAmount: 1, withSymbol: true, tokenSymbol: "tBTC" },
  },
].map(({ text, value }) => ({
  text,
  value: <InlineTokenBalance {...value} />,
}))

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

  const onSubmit = useCallback(
    async (values: FormValues) => {
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

      // if the user has NOT declined the json file, ask the user if they want to accept the new file
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
    },
    [setShouldDownloadDepositReceipt]
  )

  return (
    <>
      <BridgeProcessTitle />
      <VStack align="stretch" spacing="10" px="20" my="10">
        <MintingProcessForm
          innerRef={formRef}
          formId="tbtc-minting-data-form"
          initialEthAddress={account!}
          btcRecoveryAddress={""}
          bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
          onSubmitForm={onSubmit}
        />
        <TransactionInfoTable transactionInfo={mockTransactionInfo} />
        <Checkbox defaultChecked onChange={handleDepositReceiptAgreementChange}>
          Download Deposit Receipt (recommended)
        </Checkbox>
        <Button
          isLoading={isSubmitButtonLoading}
          loadingText={"Processing..."}
          type="submit"
          form="tbtc-minting-data-form"
          isFullWidth
          data-ph-capture-attribute-button-name={`Continue (Deposit flow)`}
        >
          Continue
        </Button>
        <BodyMd textAlign="center" color="white">
          tBTC is a 1-1 representation of Bitcoin on Base. You can revert
          anytime.
        </BodyMd>
      </VStack>
    </>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
