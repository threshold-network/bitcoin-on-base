import {
  AlertStatus,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertProps as AlertPropsBase,
  CloseButton,
  VStack,
  Stack,
  Flex,
  Icon,
  Box,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { setTimeout, clearTimeout } from "../../utils/setTimeout"
import { ToastCollapsibleDetails } from "./ToastCollapsibleDetails"
import { spacing } from "@chakra-ui/theme/foundations/spacing"
import { customBreakpoints } from "../../theme"
import { IconType } from "react-icons"
import { AnimatePresence, motion } from "framer-motion"

export interface ToastInternalProps {
  id: number
  onUnmount?: () => void
}

type PositionType = "left" | "center" | "right"
export interface ToastProps {
  title: string
  status: AlertStatus
  description?: string
  duration?: number
  isDismissable?: boolean
  orientation?: "horizontal" | "vertical"
  position?: PositionType
  icon?: IconType
}
type AlertProps = ToastProps &
  Omit<AlertPropsBase, "position" | "variant"> &
  Omit<ToastInternalProps, "id">

const getPositioningProps = (position: PositionType) => {
  if (position !== "center") {
    return {
      [position]: `max(0vw, calc((100vw - ${customBreakpoints["3xl"]}) / 2))`,
      top: { base: "4.5rem", lg: 28 },
      mx: { base: 2, lg: 10 },
    }
  }
  return {
    top: { base: "4.5rem", lg: 20 },
    left: "50%",
    mx: { base: 0, lg: undefined },
  }
}

const getMaxWidth = (position: PositionType, isDismissable: boolean) => {
  if (position === "center" && isDismissable) {
    return "toast-width"
  }
  if (position !== "center") {
    return "toast-width-aside"
  }
  return "min-content"
}

const Toast: FC<AlertProps> = ({
  title,
  description,
  duration = Infinity,
  isDismissable = duration === Infinity,
  children,
  orientation = "horizontal",
  position = "center",
  icon,
  onUnmount,
  ...restProps
}) => {
  const [isMounted, setIsMounted] = useState(true)
  const isCentered = position === "center"

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(false)
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isMounted && onUnmount) {
      onUnmount()
    }
  }, [isMounted])

  return (
    <AnimatePresence>
      {isMounted ? (
        <Box
          as={motion.div}
          initial={{ x: isCentered ? "-50%" : 0, y: -48, opacity: 0 }}
          animate={{ x: isCentered ? "-50%" : 0, y: 0, opacity: 1 }}
          exit={{ x: isCentered ? "-50%" : 0, y: -48, opacity: 0 }}
          position="fixed"
          zIndex="toast"
          w={{ base: `calc(100% - 2 * ${spacing[2]})`, md: "100%" }}
          maxW={getMaxWidth(position, isDismissable)}
          {...getPositioningProps(position)}
        >
          <Alert
            variant="solid"
            w="full"
            boxShadow="lg"
            alignItems="center"
            whiteSpace="nowrap"
            px={6}
            py={5}
            {...restProps}
          >
            <VStack spacing={4} w="full" align="stretch">
              <Flex>
                <Icon as={icon ?? AlertIcon} w={5} h={5} mt={0} mr={4} />
                <Stack
                  spacing={orientation === "horizontal" ? 0 : 2}
                  direction={orientation === "horizontal" ? "row" : "column"}
                  flex={1}
                >
                  {title ? (
                    <AlertTitle lineHeight={5}>{title}</AlertTitle>
                  ) : null}
                  {description ? (
                    <AlertDescription
                      lineHeight={5}
                      color="hsl(0, 0%, 56%)"
                      whiteSpace="normal"
                    >
                      {description ?? title}
                    </AlertDescription>
                  ) : null}
                </Stack>
                {isDismissable ? (
                  <CloseButton
                    color="hsl(0, 0%, 56%)"
                    onClick={() => setIsMounted(false)}
                    w={5}
                    h={5}
                  />
                ) : null}
              </Flex>
              {children}
            </VStack>
          </Alert>
        </Box>
      ) : null}
    </AnimatePresence>
  )
}

const ToastNamespace = Object.assign(Toast, {
  CollapsibleDetails: ToastCollapsibleDetails,
})

export default ToastNamespace
