import { PartsStyleFunction } from "@chakra-ui/theme-tools"

const baseStyle: PartsStyleFunction = () => {
  return {
    icon: {
      color: "hsl(182, 100%, 70%)",
      w: 6,
      h: 6,
    },
  }
}

export const CheckListItem = {
  baseStyle,
}
