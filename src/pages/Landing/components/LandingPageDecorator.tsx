import { ComponentProps, FC } from "react"
import { CircularLoader } from "../../../components/CircularLoader"
import { Base as BaseIcon } from "../../../static/icons/Base"
import LandingPageContentWrapper from "./LandingPageContentWrapper"

const LandingPageDecorator: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper gridArea={{ xl: "decorator" }} {...props}>
    <CircularLoader label={""} />
  </LandingPageContentWrapper>
)

export default LandingPageDecorator
