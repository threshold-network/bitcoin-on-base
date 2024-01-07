import {
  AlertStatus,
  Alert,
  AlertIcon,
  Stack,
  AlertTitle,
  AlertDescription,
  AlertProps as AlertPropsBase,
  CloseButton,
  Icon,
  HStack,
  BodyMd,
  StackProps,
} from "@threshold-network/components"
import { useCallback, useEffect, useState } from "react"
import { IconType } from "react-icons"
import {
  BsExclamationCircleFill as warningIcon,
  BsInfoCircleFill as infoIcon,
} from "react-icons/bs"
import { setTimeout, clearTimeout } from "../../utils/setTimeout"

const iconsMap = new Map<AlertStatus, IconType>([
  ["info", infoIcon],
  ["warning", warningIcon],
])

const colorMap = new Map<AlertStatus, string>([
  ["info", "hsla(182, 100%, 70%)"],
  ["warning", "hsla(0, 100%, 70%)"],
])

export interface ToastProps extends StackProps {
  title: string
  status: AlertStatus
  icon?: IconType
  description?: string
  duration?: number
  isDismissable?: boolean
  onDismiss?: () => void
}

const Toast = (props: ToastProps) => {
  const {
    title,
    description,
    duration = Infinity,
    isDismissable = true,
    icon: customIcon,
    status = "info",
    onDismiss,
    ...restProps
  } = props

  const icon = customIcon ?? iconsMap.get(status)
  const color = colorMap.get(status)

  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(false)
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  const handleDismiss = useCallback(() => {
    setIsMounted(false)
    !!onDismiss && onDismiss()
  }, [onDismiss])

  return isMounted ? (
    <HStack
      spacing={4}
      px={6}
      py={5}
      bgGradient="linear(315.46deg, #0A1616 -0.82%, #090909 100%)"
      border="1px solid"
      borderColor="hsla(0, 0%, 100%, 10%)"
      rounded="lg"
      position="absolute"
      top={20}
      left="50%"
      transform="translateX(-50%)"
      width="auto"
      boxShadow="lg"
      alignItems="center"
      whiteSpace="nowrap"
      {...restProps}
    >
      <Icon as={icon} color={color} w={5} h={5} />
      <HStack spacing={4} mr="auto">
        <BodyMd fontWeight="medium" color={color}>
          {title}
        </BodyMd>
        {description ? (
          <BodyMd color="hsla(0, 0%, 100%, 60%)">{description}</BodyMd>
        ) : null}
      </HStack>
      {isDismissable && <CloseButton h={5} w={5} onClick={handleDismiss} />}
    </HStack>
  ) : null
}

export default Toast
