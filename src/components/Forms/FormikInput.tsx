import { FC } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  BodySm,
} from "@threshold-network/components"
import { useField } from "formik"
import TooltipIcon from "../TooltipIcon"
import HelperErrorText from "./HelperErrorText"

export const FormikInput: FC<
  FormControlProps & {
    name: string
    label: string
    secondaryLabel?: string
    helperText?: string | JSX.Element
    placeholder?: string
    tooltip?: string
  }
> = ({
  name,
  label,
  secondaryLabel,
  helperText,
  placeholder,
  tooltip,
  ...restProps
}) => {
  const [field, meta] = useField(name)

  const isError = Boolean(meta.touched && meta.error)

  const secondaryLabelColor = "gray.500"

  return (
    <FormControl isInvalid={isError} {...restProps}>
      <Stack
        direction="row"
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center">
          <FormLabel
            m={0}
            htmlFor={name}
            // TODO: Make label white on input's hover / focus-visible
            color="hsla(0, 0%, 100%, 50%)"
            fontSize={18}
          >
            {label}{" "}
            {tooltip && (
              <TooltipIcon
                // Unset color to get the same color as label.
                color="unset"
                label={tooltip}
                width="20px"
                height="20px"
                alignSelf="center"
                m="auto"
                verticalAlign="text-top"
              />
            )}
          </FormLabel>
        </Stack>
        {secondaryLabel && (
          <FormLabel
            as={BodySm}
            htmlFor={name}
            color={secondaryLabelColor}
            m={0}
          >
            {secondaryLabel}
          </FormLabel>
        )}
      </Stack>
      <Input
        id={name}
        isInvalid={isError}
        errorBorderColor="red.300"
        focusBorderColor="#66F9FF"
        placeholder={placeholder}
        _placeholder={{
          color: "hsla(0, 0%, 100%, 60%)",
          fontWeight: "normal",
        }}
        {...field}
        value={meta.value}
        minH={"72px"}
        px={6}
        py={3}
        fontSize={18}
        lineHeight={"24px"}
        fontWeight={"black"}
        borderColor={"hsla(0, 0%, 100%, 10%)"}
        bg={"hsla(0, 0%, 0%, 30%)"}
        _focusVisible={{
          bg: "hsla(0, 0%, 100%, 10%)",
        }}
      />
      <HelperErrorText
        helperText={helperText}
        errorMsgText={meta.error}
        hasError={isError}
      />
    </FormControl>
  )
}
