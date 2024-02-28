import { FC } from "react"
import { Box, BoxProps, Grid } from "@chakra-ui/react"
import backgroundSrc from "../../../static/images/landing-page-layout-background.svg"

const LandingPageLayout: FC<BoxProps> = ({ children, ...restProps }) => (
  <Box
    bgColor="black"
    bgImage={backgroundSrc}
    bgRepeat="no-repeat"
    bgPos="100% 0"
    bgSize="65%"
    w="full"
    py={10}
  >
    <Grid
      mx="auto"
      maxW="content-max-width"
      minH="100vh"
      position="relative"
      borderX="1px"
      borderColor="whiteAlpha.250"
      _before={{
        content: `" "`,
        position: "absolute",
        top: 0,
        left: "50%",
        w: "1px",
        h: "full",
        background: "whiteAlpha.250",
      }}
      autoRows="min-content"
      templateColumns="repeat(2, 1fr)"
      {...restProps}
    >
      {children}
    </Grid>
  </Box>
)

export default LandingPageLayout
