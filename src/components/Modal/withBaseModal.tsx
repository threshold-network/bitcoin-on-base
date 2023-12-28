import { ComponentType } from "react"
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { BaseModalProps } from "../../types"

function withBaseModal<T extends BaseModalProps>(
  WrappedModalContent: ComponentType<T>
) {
  return (props: T) => {
    return (
      <Modal
        isOpen
        onClose={props.closeModal}
        size="lg"
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(16px)" bg="blackAlpha.600" />
        <ModalContent
          mt="200px"
          bgGradient="radial(circle at bottom right, #0A1616, #090909)"
          border="1px solid"
          borderColor="border.50"
          rounded="lg"
        >
          <WrappedModalContent {...props} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withBaseModal
