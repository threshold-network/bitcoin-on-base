import { FC } from "react"
import { FormikErrors, withFormik } from "formik"
import {
  BodyLg,
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  BoxLabel,
  Button,
  HStack,
  LabelSm,
} from "@threshold-network/components"
import {
  Form,
  FormikInput,
  FormikTokenBalanceInput,
} from "../../../components/Forms"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import { BridgeProcessCardSubTitle } from "./components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import {
  BridgeContractLink,
  BridgeProcessIndicator,
  TBTCText,
} from "../../../components/tBTC"
import {
  Step,
  StepBadge,
  StepDescription,
  StepIndicator,
  Steps,
  StepTitle,
} from "../../../components/Step"
import { tBTCFillBlack } from "../../../static/icons/tBTCFillBlack"
import { getErrorsObj } from "../../../utils/forms"
import { PageComponent } from "../../../types"

export const UnmintPage: PageComponent = ({}) => {
  return (
    <BridgeLayout>
      <BridgeLayoutMainSection>
        <BridgeProcessCardTitle bridgeProcess="unmint" />
        <BridgeProcessCardSubTitle
          stepText="Step 1"
          subTitle="Unmint your tBTC tokens"
        />
        <BodyMd color="gray.500">
          Unminting requires one Ethereum transaction and it takes around 5
          hours.
        </BodyMd>
        <UnmintForm
          maxTokenAmount="1050000000000000000"
          onSubmitForm={() => console.log("TODO: handle submit")}
        />
        <Box as="p" textAlign="center" mt="4">
          <BridgeContractLink />
        </Box>
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        <LabelSm>Duration</LabelSm>
        <HStack mt="4" spacing="4">
          <BoxLabel variant="solid" status="primary">
            ~ 5 Hours
          </BoxLabel>
          <Box>
            <BodyXs as="span" color="gray.500">
              min.
            </BodyXs>{" "}
            <BodyLg as="span" color="gray.500">
              0.01
            </BodyLg>{" "}
            <BodyXs as="span" color="gray.500">
              BTC
            </BodyXs>
          </Box>
        </HStack>
        <LabelSm mt="8">Timeline</LabelSm>
        <Steps mt="6">
          <Step isActive={true} isComplete={false}>
            <StepIndicator>Step 1</StepIndicator>
            <StepBadge>action on Ethereum</StepBadge>
            <StepBadge>action on Bitcoin</StepBadge>
            <StepTitle>
              Unmint <TBTCText />
            </StepTitle>
            <StepDescription>
              Your unwrapped and withdrawn BTC will be sent to the BTC address
              of your choice, in the next sweep.
            </StepDescription>
          </Step>
        </Steps>

        <BridgeProcessIndicator bridgeProcess="unmint" mt="8" />
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

type UnmintFormBaseProps = {
  maxTokenAmount: string
}

const UnmintFormBase: FC<UnmintFormBaseProps> = ({ maxTokenAmount }) => {
  return (
    <Form mt={10}>
      <FormikTokenBalanceInput
        name="amount"
        label={
          // TODO: Extract to a shared component- the same layout is used in
          // `TokenAmountForm` and `UnstakingFormLabel` components.
          <>
            <Box as="span">Amount </Box>
            <BodySm as="span" float="right" color="gray.500">
              <InlineTokenBalance
                tokenAmount={maxTokenAmount}
                withSymbol
                tokenSymbol="tBTC"
              />
            </BodySm>
          </>
        }
        placeholder="Amount you want to unmint"
        max={maxTokenAmount}
        icon={tBTCFillBlack}
      />
      <FormikInput
        name="btcAddress"
        label="BTC Address"
        // TODO: add BTC addresse prefixes
        tooltip={`This address needs to start with TODO!!. This is where your BTC funds are sent.`}
        placeholder={`BTC Address should start with TODO!!!`}
        mt="6"
      />
      <Button size="lg" w="100%" mt="10">
        Unmint
      </Button>
    </Form>
  )
}

type UnmintFormValues = {
  amount: string
  btcAddress: string
}

type UnmitnFormProps = {
  onSubmitForm: (values: UnmintFormValues) => void
} & UnmintFormBaseProps

const UnmintForm = withFormik<UnmitnFormProps, UnmintFormValues>({
  mapPropsToValues: () => ({
    amount: "",
    btcAddress: "",
  }),
  validate: async (values, props) => {
    // TODO: add form validation
    const errors: FormikErrors<UnmintFormValues> = {}

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
  enableReinitialize: true,
})(UnmintFormBase)

UnmintPage.route = {
  path: "unmint",
  index: false,
  title: "Unmint",
  isPageEnabled: true,
}
