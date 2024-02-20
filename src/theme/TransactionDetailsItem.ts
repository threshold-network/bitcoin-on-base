import { PartsStyleObject, anatomy } from "@chakra-ui/theme-tools"

const parts = anatomy("TransactionDetailsItem").parts(
  "container",
  "label",
  "value"
)

const baseStyle: PartsStyleObject<typeof parts> = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "md",
    lineHeight: "base",
  },
}

const variants: PartsStyleObject = {
  simple: {
    label: { color: "hsl(0, 0%, 50%)" },
    value: { color: "white" },
  },
  bold: {
    label: { color: "white" },
    value: { fontWeight: "bold" },
  },
  highlight: {
    label: { color: "white" },
    value: { fontWeight: "bold", color: "brand.100" },
  },
}

export const TransactionDetailsItem = {
  defaultProps: {
    variant: "simple",
  },
  parts: parts.keys,
  baseStyle,
  variants,
}
