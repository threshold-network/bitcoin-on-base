import {
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { ComponentType } from "react"
import { BaseModalProps } from "../../types"

function withBaseModal<T extends BaseModalProps>(
  WrappedModalContent: ComponentType<T>,
  label?: string,
  removeCloseButton?: boolean
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
          borderColor="whiteAlpha.250"
          rounded="lg"
        >
          <ModalHeader
            as={Flex}
            align="center"
            justify="space-between"
            p={6}
            mb={4}
          >
            {label ? (
              <Text as="h2" fontSize="xl" lineHeight={6} fontWeight="medium">
                {label}
              </Text>
            ) : null}
            {removeCloseButton ? null : (
              <ModalCloseButton ml="auto" position="relative" inset={0} />
            )}
          </ModalHeader>
          <WrappedModalContent {...props} />
        </ModalContent>
      </Modal>
    )
  }
}

export default withBaseModal
