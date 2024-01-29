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

const solidStyles = {
  container: {
    bg: "linear-gradient(315deg, #0A1616 0%, #090909 100%)",
    border: "1px solid",
    borderColor: "whiteAlpha.250",
  },
}

const subtleStatusStyles = (props: AlertProps) => {
  const { status } = props

  const styleMap = new Map([
    ["info", statusInfo],
    ["warning", statusWarning],
    ["success", statusSuccess],
    ["error", statusError],
  ])

  return styleMap.get(status!) || {}
}

const solidStatusStyles = (props: AlertProps) => {
  const { status } = props

  const styles = new Map([
    ["info", statusInfo],
    ["warning", statusWarning],
    ["success", statusSuccess],
    ["error", statusError],
  ]).get(status!)

  if (styles) {
    styles.container = Object.assign(styles.container, solidStyles.container)
  }

  return styles || {}
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
    subtle: subtleStatusStyles,
    solid: solidStatusStyles,
  },
}
