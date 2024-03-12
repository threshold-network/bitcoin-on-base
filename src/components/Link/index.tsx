import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  forwardRef,
  Icon,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
  useColorModeValue,
} from "@threshold-network/components"
import { TbExternalLink as ExternalLinkIcon } from "react-icons/tb"

interface CommonLinkProps {
  icon?: ReactElement
}

type ConditionalLinkProps =
  | { isExternal?: false; to: string; href?: never }
  | { isExternal: true; to?: never; href: string }

export type LinkProps = ChakraLinkProps & CommonLinkProps & ConditionalLinkProps

const Link: FC<LinkProps> = forwardRef(
  ({ isExternal, href, to, icon, children, ...props }, ref) => {
    const defaultColor = useColorModeValue("brand.500", "white")
    const finalColor = props.color ? props.color : defaultColor

    return (
      <ChakraLink
        as={isExternal ? "a" : RouterLink}
        ref={isExternal ? ref : undefined}
        href={isExternal ? href : undefined}
        to={isExternal ? undefined : to}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        color={finalColor}
        textDecoration="underline"
        {...props}
      >
        {children}
        {icon ? (
          icon
        ) : isExternal ? (
          <Icon ml={1} w={4} h={4} as={ExternalLinkIcon} />
        ) : null}
      </ChakraLink>
    )
  }
)

export default Link
