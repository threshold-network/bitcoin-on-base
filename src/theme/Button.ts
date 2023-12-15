import { buttonAnatomy } from "@chakra-ui/anatomy"
import {
  PartsStyleFunction,
  StyleConfig,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"

const variants: Record<string, SystemStyleObject> = {
  solid: {
    bg: "hsl(182, 100%, 70%)",
    color: "black",
    _hover: {
      bg: "hsl(182, 100%, 25%)",
      color: "white",
    },
  },
  outline: {
    bg: "transparent",
    color: "hsl(182, 100%, 70%)",
  },
}

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    px: 7,
    py: 5,
    borderRadius: "2xl",
    h: 16,
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: "black",
  },
  md: {
    px: 6,
    py: 4,
    borderRadius: "2xl",
    textTransform: "uppercase",
    h: 14,
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "black",
  },
}

export const Button: StyleConfig = {
  variants,
  sizes,
}
