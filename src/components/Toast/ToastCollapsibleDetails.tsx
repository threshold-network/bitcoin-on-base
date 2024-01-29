import {
  HStack,
  FlexProps,
  Box,
  Button,
  Icon,
  useDisclosure,
  Text,
  Flex,
} from "@chakra-ui/react"
import {
  HiOutlinePlus as PlusIcon,
  HiOutlineMinus as MinusIcon,
} from "react-icons/hi"
import { ExternalHref } from "../../enums"
import Link from "../Link"

type ToastCollapsibleDetailsProps = Omit<FlexProps, "children"> & {
  children: string
}

export const ToastCollapsibleDetails = ({
  children,
  ...restProps
}: ToastCollapsibleDetailsProps) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Flex {...restProps} flex={1} align="flex-start" direction="column">
      <Button
        variant="outline"
        size="sm"
        borderWidth={0}
        onClick={onToggle}
        textTransform="unset"
        pl={0}
        pr={0}
        py={4}
        mt={-4}
        mb={isOpen ? 0 : -4}
        leftIcon={<Icon as={isOpen ? MinusIcon : PlusIcon} />}
      >
        Show {isOpen ? "less" : "more"}
      </Button>
      {isOpen ? (
        <>
          <Box
            as="pre"
            bg="hsl(0, 0%, 12%)"
            color="hsla(0, 0%, 100%, 80%)"
            whiteSpace="pre-wrap"
            w="full"
            p={4}
            fontFamily="monospace"
            fontSize="sm"
            maxH="xs"
            overflowY="scroll"
          >
            {children}
          </Box>
          <HStack w="full" justify="flex-end" mt={4}>
            <Text color="hsla(0, 0%, 100%, 90%)">
              Get help on&nbsp;
              <Link
                isExternal
                href={ExternalHref.thresholdDiscord}
                color="brand.100"
              >
                Discord
              </Link>
            </Text>
          </HStack>
        </>
      ) : null}
    </Flex>
  )
}
