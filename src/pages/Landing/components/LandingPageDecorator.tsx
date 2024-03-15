import { ComponentProps, FC } from "react"
import { CircularLoader } from "../../../components/CircularLoader"
import { Base as BaseIcon } from "../../../static/icons/Base"
import LandingPageContentWrapper from "./LandingPageContentWrapper"

const LandingPageDecorator: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper
    gridArea={{ xl: "decorator" }}
    display="flex"
    alignItems="center"
    {...props}
  >
    <CircularLoader
      progress={0.04}
      withWings={false}
      maxW="40.625rem" // 650px
      mx="auto"
    >
      <BaseIcon
        w="75%"
        h="75%"
        p="12%"
        mx="auto"
        border="6px solid"
        borderColor="whiteAlpha.250"
        rounded="full"
      />
    </CircularLoader>
  </LandingPageContentWrapper>
)

export default LandingPageDecorator
