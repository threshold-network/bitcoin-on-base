import { FC } from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  Button,
  Icon,
} from "@chakra-ui/react"
import { BodySm } from "@threshold-network/components"
import { ExternalHref } from "../../../enums"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import Link from "../../Link"
import {
  HiOutlinePlus as PlusIcon,
  HiOutlineMinus as MinusIcon,
} from "react-icons/hi"

interface TransactionFailedProps extends BaseModalProps {
  transactionHash?: string
  error: string
  isExpandableError?: boolean
}

const TransactionFailed: FC<TransactionFailedProps> = ({
  error,
  isExpandableError,
}) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <ModalBody p={0}>
        <VStack spacing={0}>
          <VStack
            align="flex-start"
            alignSelf="stretch"
            spacing={4}
            p={6}
            pt={0}
          >
            <Alert status="error" alignSelf="stretch">
              <AlertIcon />
              <AlertTitle display="flex">Transaction error occured</AlertTitle>
            </Alert>
            {isExpandableError ? (
              <Button
                variant="outline"
                size="sm"
                borderWidth={0}
                onClick={onToggle}
                leftIcon={<Icon as={isOpen ? MinusIcon : PlusIcon} />}
              >
                Show {isOpen ? "less" : "more"}
              </Button>
            ) : null}
          </VStack>
          {isExpandableError && isOpen ? (
            <Box p={6} pb={0} borderTop="1px solid" borderColor="inherit">
              <Box
                as="pre"
                bg="hsl(0, 0%, 12%)"
                color="hsla(0, 0%, 100%, 80%)"
                p={4}
                whiteSpace="pre-wrap"
                fontFamily="monospace"
                maxH="xs"
                overflowY="scroll"
              >
                {error}
              </Box>
            </Box>
          ) : null}
        </VStack>
      </ModalBody>
      <ModalFooter p={6}>
        <BodySm>
          Get help on&nbsp;
          <Link
            isExternal
            href={ExternalHref.thresholdDiscord}
            color="brand.100"
          >
            Discord
          </Link>
        </BodySm>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionFailed, "Error")
