import { ButtonProps } from "@chakra-ui/react"

export const Button = {
  defaultProps: {
    colorScheme: "brand",
    iconSpacing: "16px",
  },
  variants: {
    solid: (props: ButtonProps) => {
      const _disabled = {
        backgroundColor: "gray.100",
        color: "gray.700",
      }

      return {
        color: "black",
        backgroundColor: "brand.100",
        textTransform: "uppercase",
        pl: !!props.leftIcon ? 4 : 6,
        pr: !!props.rightIcon ? 4 : 6,
        py: 4,
        rounded: "2xl",
        h: "auto",
        _disabled,
        _hover: {
          backgroundColor: "brand.700",
          _disabled,
        },
        _active: {
          backgroundColor: "brand.900",
        },
      }
    },
    outline: (props: ButtonProps) => ({
      color: "brand.100",
      borderColor: "border",
      textTransform: "uppercase",
      fontSize: "sm",
      pl: !!props.leftIcon ? 2 : 3,
      pr: !!props.rightIcon ? 2 : 3,
      py: 3,
      rounded: "xl",
      h: "auto",
      _hover: {
        color: "white",
        borderColor: "brand.100",
      },

      _disabled: {
        opacity: 0.25,
      },
    }),
  },
}
