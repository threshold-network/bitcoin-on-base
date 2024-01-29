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
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { setTimeout, clearTimeout } from "../../utils/setTimeout"
import { ToastCollapsibleDetails } from "./ToastCollapsibleDetails"
import { spacing } from "@chakra-ui/theme/foundations/spacing"

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
}
type AlertProps = ToastProps &
  Omit<AlertPropsBase, "position" | "variant"> &
  Omit<ToastInternalProps, "id">

const getPositioningProps = (position: PositionType) => {
  if (position !== "center") {
    return {
      [position]: "max(0vw, calc((100vw - 1920px) / 2))", // TODO: replace with theme value
      top: { base: 16, lg: 112 },
      mx: { base: 2, lg: 10 },
    }
  }
  return {
    top: { base: 6, lg: 20 },
    left: "50%",
    transform: "translateX(-50%)",
    mx: { base: 0, lg: undefined },
    w: { base: `calc(100% - 2 * ${spacing[2]})`, md: "100%" },
  }
}

const Toast: FC<AlertProps> = ({
  title,
  description,
  duration = Infinity,
  isDismissable = true,
  children,
  orientation = "horizontal",
  position = "center",
  ...restProps
}) => {
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(false)
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted ? (
    <Alert
      variant="solid"
      position="fixed"
      maxW="toast-width"
      boxShadow="lg"
      alignItems="center"
      whiteSpace="nowrap"
      px={6}
      py={5}
      zIndex="toast"
      {...getPositioningProps(position)}
      {...restProps}
    >
      <VStack spacing={4} w="full" align="stretch">
        <Flex>
          <AlertIcon w={5} h={5} mt={0} mr={4} />
          <Stack
            spacing={orientation === "horizontal" ? 0 : 2}
            direction={orientation === "horizontal" ? "row" : "column"}
            flex={1}
          >
            {title ? <AlertTitle lineHeight={5}>{title}</AlertTitle> : null}
            {description ? (
              <AlertDescription lineHeight={5} color="hsl(0, 0%, 56%)">
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
  ) : (
    <></>
  )
}

const ToastNamespace = Object.assign(Toast, {
  CollapsibleDetails: ToastCollapsibleDetails,
})

export default ToastNamespace
