import { AlertProps } from "@chakra-ui/react"

const defaultProps = {
  status: "info",
  variant: "subtle",
}

const statusWarning = {
  container: {
    bg: "hsla(26, 96%, 65%, 10%)",
    color: "hsla(0, 0%, 100%, 80%)",
  },
  icon: {
    color: "#FB9950",
  },
}

const statusInfo = {
  container: {
    color: "white",
    bg: "#1E1E1E",
  },
  icon: {
    color: "currentColor",
  },
}

const statusSuccess = {
  container: {
    color: "#66FFB6",
    bg: "#1E1E1E",
  },
  icon: {
    color: "currentColor",
  },
}

const statusError = {
  container: {
    bg: "hsla(0, 100%, 70%, 10%)",
    color: "#FF6666",
  },
  icon: {
    color: "currentColor",
  },
}

const statusStyles = (props: AlertProps) => {
  const { status } = props

  const styleMap = new Map([
    ["info", statusInfo],
    ["warning", statusWarning],
    ["success", statusSuccess],
    ["error", statusError],
  ])

  return styleMap.get(status!) || {}
}

export const Alert = {
  defaultProps,
  baseStyle: {
    icon: {
      alignSelf: "flex-start",
      w: 5,
      h: 5,
      mt: 0.5,
      mr: 2,
    },
    container: {
      px: 4,
      py: 3,
      rounded: "2xl",
      fontSize: "md",
      lineHeight: "base",
    },
    title: {
      fontWeight: "base",
    },
  },
  variants: {
    subtle: statusStyles,
  },
}
