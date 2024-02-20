import { Spinner as BaseSpinner, SpinnerProps } from "@chakra-ui/react"
import { FC } from "react"

// Maybe we should build this component in Chakra way and make it more
// reusable.
const Spinner: FC<SpinnerProps> = (props) => {
  return (
    <BaseSpinner
      speed="1.75s"
      emptyColor="hsl(0, 0%, 12%)"
      color="brand.100"
      w={20}
      h={20}
      {...props}
    />
  )
}

export default Spinner
