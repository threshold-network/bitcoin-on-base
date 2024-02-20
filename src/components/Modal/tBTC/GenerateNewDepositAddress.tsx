import { FC } from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Icon,
  ModalBody,
  ModalFooter,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { useRemoveDepositData } from "../../../hooks/tbtc/useRemoveDepositData"
import { HiChevronLeft as ChevronLeftIcon } from "react-icons/hi"

const GenerateNewDepositAddressBase: FC<BaseModalProps> = ({ closeModal }) => {
  const removeDepositData = useRemoveDepositData()

  const onConfirmClick = () => {
    removeDepositData()
    closeModal()
  }

  return (
    <>
      <ModalBody
        as={Flex}
        direction="column"
        borderY="1px solid"
        borderColor="whiteAlpha.250"
        px={10}
        py={0}
        mt={-4}
      >
        <Text
          fontSize="2xl"
          lineHeight={8}
          fontWeight="medium"
          color="hsl(180, 0%, 52%)"
          my={6}
        >
          Going back means you will redo Step 1 and you'll need to generate a{" "}
          <Text as="span" fontWeight="bold" color="hsl(182, 0%, 81%)">
            new deposit address.
          </Text>
        </Text>
        <StackDivider borderWidth={1} mx={-10} />
        <Alert status="warning" my={6}>
          <AlertIcon />
          <AlertTitle>
            Your current deposit address will no longer be valid.
          </AlertTitle>
        </Alert>
      </ModalBody>
      <ModalFooter py={6} justifyContent="space-between">
        <Button
          size="sm"
          onClick={onConfirmClick}
          variant="outline"
          mr="3"
          leftIcon={<Icon w={5} h={5} as={ChevronLeftIcon} />}
        >
          Redo Step 1
        </Button>
        <Button size="sm" onClick={closeModal}>
          Stay on this page
        </Button>
      </ModalFooter>
    </>
  )
}

export const GenerateNewDepositAddress = withBaseModal(
  GenerateNewDepositAddressBase,
  "Please Be Aware"
)
