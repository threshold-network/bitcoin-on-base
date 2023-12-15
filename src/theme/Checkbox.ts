import { checkboxAnatomy } from "@chakra-ui/anatomy"
import { PartsStyleFunction } from "@chakra-ui/theme-tools"

const baseStyle: PartsStyleFunction<typeof checkboxAnatomy> = () => {
  return {
    control: {
      p: 2.5,
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
    },
    icon: {
      // TODO: Make icon white on hover / focus-visible
      color: "black",
    },
  }
}

export const Checkbox = {
  baseStyle,
}
