import { FC } from "react"
import { Box, BoxProps } from "@chakra-ui/react"

const LandingPageContentWrapper: FC<BoxProps> = (props) => (
  <Box px={8} py={10} {...props} />
)

export default LandingPageContentWrapper
