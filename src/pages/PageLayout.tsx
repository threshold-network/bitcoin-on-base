import {
  Box,
  Flex,
  Grid,
  SystemStyleObject,
} from "@threshold-network/components"
import { ReactNode } from "react"
import PRIMARY_BACKGROUND_PATH from "../static/images/layout-background-primary.svg"
import SECONDARY_BACKGROUND_PATH from "../static/images/layout-background-secondary.svg"

const HORIZONTAL_PADDING = "13.625rem" // 218px
const BORDER = "1px solid hsla(0, 0%, 100%, 10%)"

//TODO: Remove stale layout components eg. `./Bridge/BridgeLayout.tsx` etc...

type VariantType = "primary" | "secondary"
type RenderSlotType = Nullable<ReactNode>

interface PageLayoutProps {
  /**
   * Render slot for content aligned at the top.
   *
   * @default undefined
   */
  renderTop?: RenderSlotType
  /**
   * Render slot for content aligned on the left. If the value is `null` the
   * area is left empty. If the value is not provided the main content (children
   * occupies the area.
   *
   * @default undefined
   */
  renderLeft?: RenderSlotType
  /**
   * Render slot for content aligned on the right. If the value is `null` the
   * area is left empty. If the value is not provided the main content (children)
   * occupies the area.
   *
   * @default undefined
   */
  renderRight?: RenderSlotType
  /**
   * The variant of the background.
   *
   * @default "primary"
   *  */
  backgroundVariant?: VariantType
  /** The main content of the page. */
  children: ReactNode
}

const getBackgroundStyles = (variant: VariantType): SystemStyleObject => ({
  bgImage:
    variant === "primary" ? PRIMARY_BACKGROUND_PATH : SECONDARY_BACKGROUND_PATH,
  bgRepeat: "no-repeat",
  bgSize: variant === "primary" ? "contain" : "cover",
  bgPosition: "bottom",
  bgAttachment: "fixed",
})

/**
 * Renders the page wrapped in layout with render slots for content alignment.
 * @param {PageLayoutProps} props - The props for the PageLayout component.
 * @return {JSX.Element} The rendered page wrapped in layout.
 */
export default function PageLayout(props: PageLayoutProps) {
  const {
    renderTop,
    renderLeft,
    renderRight,
    backgroundVariant = "primary",
    children,
    ...restProps
  } = props

  const childrenContainerColumnSpan = [
    renderLeft === null || renderLeft !== undefined ? 2 : 1,
    renderRight === null || renderRight !== undefined ? 4 : 5,
  ].join("/")

  return (
    <Flex
      flexFlow={"column"}
      alignItems={"normal"}
      bg={"black"}
      minHeight={"100vh"}
      sx={getBackgroundStyles(backgroundVariant)}
      {...restProps}
    >
      {/* <Header /> */}
      {!!renderTop && (
        <Box px={HORIZONTAL_PADDING} py={6} borderBottom={BORDER}>
          {renderTop}
        </Box>
      )}
      <Grid
        templateColumns={"repeat(4, .5fr)"}
        w={`calc(100% - calc(${HORIZONTAL_PADDING} * 2))`}
        margin={"auto"}
        borderLeft={renderLeft !== undefined ? BORDER : ""}
        borderRight={renderRight !== undefined ? BORDER : ""}
        flex={1}
      >
        {!!renderLeft && <Box p={10}>{renderLeft}</Box>}
        <Box gridColumn={childrenContainerColumnSpan} borderX={BORDER}>
          {children}
        </Box>
        {!!renderRight && <Box p={10}>{renderRight}</Box>}
      </Grid>
    </Flex>
  )
}
