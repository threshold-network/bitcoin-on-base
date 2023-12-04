import { Grid, Flex, Box } from "@threshold-network/components"
import { ReactNode } from "react"

const HORIZONTAL_PADDING = 224
const BORDER = "1px solid #1A1A22"

//TODO: Remove stale layout components eg. `./Bridge/BridgeLayout.tsx` etc...

interface PageLayoutProps {
  /**
   * Render slot for content aligned at the top.
   *
   * @default undefined
   */
  renderTop?: Nullable<ReactNode>
  /**
   * Render slot for content aligned on the left. If the value is `null` the
   * area is left empty. If the value is the main content occupies
   * the area.
   *
   * @default undefined
   */
  renderLeft?: Nullable<ReactNode>
  /**
   * Render slot for content aligned on the right. If the value is `null` the
   * area is left empty. If the value is not provided the  main content occupies
   * the area.
   *
   * @default undefined
   */
  renderRight?: Nullable<ReactNode>
  /** The main content of the page. */
  children: ReactNode
}

/**
 * Renders the page wrapped in layout with render slots for content alignment.
 * @param {PageLayoutProps} props - The props for the PageLayout component.
 * @return {JSX.Element} The rendered page wrapped in layout.
 */
export default function PageLayout(props: PageLayoutProps) {
  const { renderTop, renderLeft, renderRight, children, ...restProps } = props

  const outletContainerColumnSpan = [
    renderLeft === null || renderLeft !== undefined ? 2 : 1,
    renderRight === null || renderRight !== undefined ? 4 : 5,
  ].join("/")

  return (
    <Flex
      flexFlow={"column"}
      alignItems={"normal"}
      bg={"black"}
      minHeight={"100vh"}
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
        w={`calc(100% - ${HORIZONTAL_PADDING * 2}px)`}
        margin={"auto"}
        borderLeft={renderLeft !== undefined ? BORDER : ""}
        borderRight={renderRight !== undefined ? BORDER : ""}
        flex={1}
      >
        {!!renderLeft && <Box p={10}>{renderLeft}</Box>}
        <Box gridColumn={outletContainerColumnSpan} borderX={BORDER}>
          {children}
        </Box>
        {!!renderRight && <Box p={10}>{renderRight}</Box>}
      </Grid>
    </Flex>
  )
}
