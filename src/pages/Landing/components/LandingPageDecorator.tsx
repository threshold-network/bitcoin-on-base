import { ComponentProps, FC } from "react"
import { Base as BaseIcon } from "../../../static/icons/Base"
import { BridgeProcessCircularLoader } from "../../tBTC/Bridge/components/BridgeProcessCircularLoader"
import LandingPageContentWrapper from "./LandingPageContentWrapper"

const LandingPageDecorator: FC<
  ComponentProps<typeof LandingPageContentWrapper>
> = (props) => (
  <LandingPageContentWrapper gridArea={{ xl: "decorator" }} {...props}>
    <BridgeProcessCircularLoader label={""} />
  </LandingPageContentWrapper>
)

export default LandingPageDecorator
