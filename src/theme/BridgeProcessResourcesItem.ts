import { PartsStyleObject, anatomy } from "@chakra-ui/theme-tools"

const parts = anatomy("BridgeProcessResourcesItem").parts(
  "container",
  "label",
  "description",
  "image"
)

const baseStyle: PartsStyleObject<typeof parts> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: "sm",
    lineHeight: 5,
    px: 4,
    gap: 3,
    rounded: "2xl",
    _hover: {
      textDecoration: "none",
    },
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    color: "hsl(0, 0%, 90%)",
    fontWeight: "bold",
    svg: {
      width: 4,
      height: 4,
      color: "brand.100",
    },
  },
  description: {
    color: "hsl(0, 0%, 50%)",
  },
  image: {
    mx: "auto",
    rounded: "lg",
    w: "full",
  },
}

const variants: PartsStyleObject = {
  expanded: {
    container: {
      py: 4,
      my: 3,
      bg: "hsl(0, 0%, 12%)",
      _hover: {
        bg: "hsl(0, 0%, 18%)",
      },
    },
  },
  folded: {
    container: {
      py: 2,
      border: "1px solid hsl(0, 0%, 12%)",
      _hover: {
        bg: "hsl(0, 0%, 12%)",
      },
    },
  },
}

export const BridgeProcessResourcesItem = {
  defaultProps: {
    variant: "folded",
  },
  parts: parts.keys,
  baseStyle,
  variants,
}
