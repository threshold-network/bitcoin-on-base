import {
  Box,
  Flex,
  FlexProps,
  Grid,
  SystemStyleObject,
  useMediaQuery,
  VStack,
} from "@threshold-network/components"
import { FC, ReactNode } from "react"
import PRIMARY_BACKGROUND_PATH from "../static/images/layout-background-primary.svg"
import SECONDARY_BACKGROUND_PATH from "../static/images/layout-background-secondary.svg"
import { spacing } from "@chakra-ui/theme/foundations/spacing"
import { Header } from "../components/Header"
import { customSizes } from "../theme"

//TODO: Remove stale layout components eg. `./Bridge/BridgeLayout.tsx` etc...

type VariantType = "primary" | "secondary"
type RenderSlotType = Nullable<ReactNode>

interface PageLayoutProps extends FlexProps {
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

const FixedContainer: FC<FlexProps> = (props) => (
  <Flex flexFlow={"column"} maxW={"1920px"} mx={"auto"} {...props} />
)

/**
 * Renders the page wrapped in layout with render slots for content alignment.
 * @param {PageLayoutProps} props - The props for the PageLayout component.
 * @return {JSX.Element} The rendered page wrapped in layout.
 */
const PageLayout: FC<PageLayoutProps> = ({
  renderTop,
  renderLeft,
  renderRight,
  backgroundVariant = "primary",
  children,
  ...restProps
}) => {
  const [hasContentMaxWidth] = useMediaQuery(
    `(min-width: ${customSizes["content-max-width"]})`
  )

  const childrenContainerColumnSpan = [
    renderLeft === null || renderLeft !== undefined ? 2 : 1,
    renderRight === null || renderRight !== undefined ? 4 : 5,
  ].join("/")

  const borderX = {
    borderLeft: renderLeft !== undefined ? "1px solid" : undefined,
    borderRight: renderRight !== undefined ? "1px solid" : undefined,
    borderColor: "whiteAlpha.250",
  }

  return (
    <Flex
      flexFlow={"column"}
      bg={"black"}
      color={"white"}
      sx={getBackgroundStyles(backgroundVariant)}
      minH={"100vh"}
      {...restProps}
    >
      <Header isDesktopViewport={hasContentMaxWidth} />
      {renderTop && (
        <Box p={6} borderBottom="1px solid" borderColor="whiteAlpha.250">
          <FixedContainer
            mx="auto"
            w="full"
            maxW={`calc(${customSizes["content-max-width"]} + 2 * ${
              hasContentMaxWidth ? "0px" : spacing[6]
            })`}
          >
            {renderTop}
          </FixedContainer>
        </Box>
      )}
      <FixedContainer flex={1} w={"full"}>
        <Grid
          templateColumns={{
            base: "auto",
            lg: ".45fr repeat(2, .5fr) .45fr",
          }}
          w="full"
          maxW="content-max-width"
          mx="auto"
          {...borderX}
          flex={1}
        >
          {renderLeft && (
            <VStack
              align="start"
              spacing={6}
              px={6}
              py={hasContentMaxWidth ? 10 : 6}
            >
              {renderLeft}
            </VStack>
          )}
          <Box
            order={{ base: -1, lg: "unset" }}
            gridColumn={{ base: "auto", lg: childrenContainerColumnSpan }}
            {...borderX}
            p={{ base: 6, lg: 10 }}
          >
            {children}
          </Box>
          {renderRight && (
            <VStack
              align="start"
              spacing={6}
              px={6}
              py={hasContentMaxWidth ? 10 : 6}
            >
              {renderRight}
            </VStack>
          )}
        </Grid>
      </FixedContainer>
    </Flex>
  )
}

export default PageLayout
