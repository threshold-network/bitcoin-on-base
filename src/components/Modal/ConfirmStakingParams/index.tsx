import { FC } from "react"
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { Body1, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import TokenBalanceInput from "../../TokenBalanceInput"
import tIcon from "../../../static/icons/ThresholdPurple"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"

interface StakingModalProps extends BaseModalProps {
  amountToStake: number
  setAmountToStake: (amount: number | string) => void
  maxAmount: number
  onSubmit: () => void
}

const StakingModal: FC<StakingModalProps> = ({
  amountToStake,
  setAmountToStake,
  maxAmount,
  onSubmit,
}) => {
  const { closeModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box borderRadius="md" bg="gray.50" p={6} mb={8}>
          <H5 mb={4}>You are about to stake T</H5>
          <Body1>
            Here is some sub text copy to explain the staking process
          </Body1>
        </Box>
        <Stack spacing={6} mb={6}>
          <Box>
            <TokenBalanceInput
              label={`T Amount`}
              amount={amountToStake}
              setAmount={setAmountToStake}
              max={maxAmount}
              icon={tIcon}
              mb={2}
            />
            <FormHelperText>
              {formatTokenAmount(maxAmount)} T available to stake.
            </FormHelperText>
          </Box>
          <Divider />
          <FormControl>
            <FormLabel>Operator Address</FormLabel>
            <Input />
            <FormHelperText>
              If you are using a staking provider, this will be their provided
              address.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Beneficiary Address</FormLabel>
            <Input />
            <FormHelperText>This address will receive rewards</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Authorizer Address</FormLabel>
            <Input />
            <FormHelperText>
              This address will authorize applications.
            </FormHelperText>
          </FormControl>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Stake</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingModal)
