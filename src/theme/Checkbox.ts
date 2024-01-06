import { checkboxAnatomy } from "@chakra-ui/anatomy"
import { PartsStyleFunction } from "@chakra-ui/theme-tools"

const baseStyle: PartsStyleFunction<typeof checkboxAnatomy> = () => {
  return {
    label: {
      display: "flex",
      alignItems: "center",
      ml: 3,
      fontWeight: "medium",
    },
    control: {
      outline: "3px solid",
      outlineColor: "transparent",
      p: 2,
      borderRadius: "md",
      _checked: {
        borderColor: "hsl(182, 100%, 70%)",
        _active: {
          borderColor: "hsl(182, 100%, 70%)",
        },
        bg: "hsl(182, 100%, 70%)",
        _hover: {
          bg: "hsl(182, 100%, 25%)",
          borderColor: "hsl(182, 100%, 25%)",
        },
      },
      _focus: {
        boxShadow: "0 0 0 3px hsla(182, 100%, 70%, 20%)",
      },
    },
    icon: {
      w: 3,
      h: 3,
      color: "#121212",
    },
  }
}

export const Checkbox = {
  baseStyle,
}
