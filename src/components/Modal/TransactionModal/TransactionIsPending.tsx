import { FC } from "react"
import { ModalBody, ModalFooter, Flex } from "@chakra-ui/react"
import { BodyLg, BodySm } from "@threshold-network/components"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import Spinner from "../../Spinner"

interface TransactionIsPendingProps extends BaseModalProps {
  pendingText?: string
  transactionHash: string
}

const TransactionIsPending: FC<TransactionIsPendingProps> = ({
  transactionHash,
  pendingText = "Pending...",
}) => {
  return (
    <>
      <ModalBody as={Flex} flexFlow="column" align="center" p={6}>
        <Spinner />
        <BodyLg mt={10} mb={9}>
          {pendingText}
        </BodyLg>
      </ModalBody>
      <ModalFooter p={6} justifyContent="center">
        <BodySm>
          <ViewInBlockExplorer
            text="View"
            id={transactionHash}
            type={ExplorerDataType.TRANSACTION}
          />
          &nbsp;transaction on Etherscan
        </BodySm>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIsPending, "Confirm (pending)")
