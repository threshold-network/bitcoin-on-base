import { FC } from "react"
import { Flex, ModalBody } from "@chakra-ui/react"
import { BodyLg } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import Spinner from "../../Spinner"

const MODAL_BODY_PB = "3.75rem"
interface Props extends BaseModalProps {
  pendingText?: string
}

const TransactionIsWaitingForConfirmation: FC<Props> = ({
  pendingText = "Please confirm the transaction in your wallet",
}) => {
  return (
    <ModalBody as={Flex} flexFlow="column" align="center" p={6}>
      <Spinner />
      <BodyLg mt={10} mb={9}>
        {pendingText}
      </BodyLg>
    </ModalBody>
  )
}

export default withBaseModal(
  TransactionIsWaitingForConfirmation,
  "Waiting for confirmations",
  true
)
