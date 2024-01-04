import { Badge, Button, useColorModeValue } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FC, Ref, useRef, useState } from "react"
import { Form, FormikInput } from "../../../../components/Forms"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { ModalType } from "../../../../enums"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useDepositTelemetry } from "../../../../hooks/tbtc/useDepositTelemetry"
import { useModal } from "../../../../hooks/useModal"
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
import { isSameETHAddress } from "../../../../web3/utils"
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
    <Form id={formId} mb={6}>
      <FormikInput
        name="ethAddress"
        label="ETH Address"
        placeholder="Address where you'll receive your tBTC"
        tooltip="ETH address is prepopulated with your wallet address. This is the address where you'll receive your tBTC."
        mb={6}
        isReadOnly={true}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip={`This address needs to start with ${resolvedBTCAddressPrefix}. Recovery Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. A Recovery Address cannot be a multi-sig or an exchange address. Funds claiming is done by using the JSON file`}
        placeholder={`BTC Address should start with ${resolvedBTCAddressPrefix}`}
      />
    </Form>
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

export const ProvideDataComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const [isSubmitButtonLoading, setSubmitButtonLoading] = useState(false)
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { openModal } = useModal()
  const threshold = useThreshold()
  const { account } = useWeb3React()
  const { setDepositDataInLocalStorage } = useTBTCDepositDataFromLocalStorage()
  const depositTelemetry = useDepositTelemetry(threshold.tbtc.bitcoinNetwork)

  const textColor = useColorModeValue("gray.500", "gray.300")

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

    // if the user has NOT declined the json file, ask the user if they want to accept the new file
    openModal(ModalType.TbtcRecoveryJson, {
      ethAddress: values.ethAddress,
      blindingFactor: receipt.blindingFactor.toString(),
      walletPublicKeyHash: receipt.walletPublicKeyHash.toString(),
      refundPublicKeyHash: receipt.refundPublicKeyHash.toString(),
      refundLocktime: receipt.refundLocktime.toString(),
      btcDepositAddress: depositAddress,
    })
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <>
      <BridgeProcessCardTitle
        onPreviousStepClick={onPreviousStepClick}
        number={1}
        title="Deposit Address"
        description="Based on these two addresses, the system will generate for you a unique BTC deposit address. There is no minting limit."
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
      <Button
        isLoading={isSubmitButtonLoading}
        loadingText={"Generating deposit address..."}
        type="submit"
        form="tbtc-minting-data-form"
        isFullWidth
        data-ph-capture-attribute-button-name={`Generate Deposit Address (Deposit flow)`}
      >
        Generate Deposit Address
      </Button>
    </>
  )
}

export const ProvideData = withOnlyConnectedWallet(ProvideDataComponent)
