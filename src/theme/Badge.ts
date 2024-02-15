import { SystemStyleFunction, SystemStyleObject } from "@chakra-ui/theme-tools"
import { defaultTheme } from "@threshold-network/components"

// TODO: probably we should add a new color schema: `magic` and use
// `colorSchema` prop instead of `variant` becasue `magic` can be `solid` and
// `otuline`. See:
// https://www.figma.com/file/zZi2fYDUjWEMPQJWAt8VWv/Threshold-DS?node-id=2356%3A20781
const variantMagic: SystemStyleFunction = (props) => {
  return {
    background: "linear-gradient(120.19deg, #BD30FF 3.32%, #7D00FF 95.02%)",
    color: "white",
  }
}

const variants = {
  ...defaultTheme.components.Badge.variants,
  magic: variantMagic,
  subtle: {
    bg: "hsl(0, 0%, 12%)",
    color: "hsl(182, 100%, 70%)",
  },
}

const sizes: Record<string, SystemStyleObject> = {
  sm: {
    px: "2",
    py: "1",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "12px",
    letterSpacing: "0.075em",
    textTransform: "uppercase",
  },
  md: {
    px: 3,
    py: 1.5,
    fontSize: "12px",
    lineHeight: 1,
    letterSpacing: "7.5%",
    fontWeight: "medium",
  },
}

const defaultProps = {
  colorScheme: "brand",
  size: "md",
}

export const Badge = {
  ...defaultTheme.components.Badge,
  defaultProps,
  variants,
  sizes,
}
