import { FC } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  useColorModeValue,
  BodySm,
  HStack,
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
      <HStack as={FormLabel} mr={0} mb={2} spacing={2} htmlFor={name}>
        <BodySm
          as="span"
          lineHeight={1.5}
          fontWeight="medium"
          color="hsl(182, 100%, 70%)"
        >
          {label}
        </BodySm>
        {tooltip && <TooltipIcon color="#888" label={tooltip} />}
      </HStack>
      {secondaryLabel && (
        // @ts-ignore - htmlFor is not a valid prop for BodySm but we're setting to label here
        <BodySm as="label" htmlFor={name} color={secondaryLabelColor} m={0}>
          {secondaryLabel}
        </BodySm>
      )}
      <Input
        variant="unstyled"
        px={6}
        py={4}
        rounded="2xl"
        border="1px solid"
        borderColor="hsl(0, 0%, 20%)"
        lineHeight={1.5}
        id={name}
        isInvalid={isError}
        errorBorderColor="red.300"
        placeholder={placeholder}
        _placeholder={{ color: "hsla(0, 0%, 100%, 30%)" }}
        _readOnly={{
          bg: "hsla(0, 0%, 20%, 30%)",
          borderColor: "hsl(0, 0%, 20%)",
        }}
        _focusVisible={{
          borderColor: "hsl(182, 100%, 70%)", // TODO: replace with theme tokens
          boxShadow: "0 0 0 3px hsla(182, 100%, 70%, 20%)",
        }}
        _invalid={{
          borderColor: "hsla(0, 100%, 70%)",
          _focusVisible: {
            boxShadow: "0 0 0 3px hsla(0, 100%, 70%, 20%)",
          },
        }}
        {...field}
        value={meta.value}
      />
      <HelperErrorText
        helperText={helperText}
        errorMsgText={meta.error}
        hasError={isError}
      />
    </FormControl>
  )
}
