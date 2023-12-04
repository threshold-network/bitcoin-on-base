import useDocumentTitle from "../hooks/useDocumentTitle"
import { Grid, Flex, Box } from "@threshold-network/components"
import { PropsWithChildren } from "react"
import { PageComponent } from "../types"

type PageLayoutRenderProps = {
  [key in "renderTop" | "renderLeft" | "renderRight"]?: Nullable<JSX.Element>
}

interface PageLayoutProps extends PropsWithChildren<PageLayoutRenderProps> {
  title?: string
  pages?: PageComponent[]
}

export default function PageLayout(props: PageLayoutProps) {
  const { renderTop, renderLeft, renderRight, children, title, ...restProps } =
    props

  useDocumentTitle(`Threshold - ${title}`)
  console.log({ renderLeft, renderRight, renderTop })
  const outletContainerColumnSpan = [
    renderLeft === null || renderLeft !== undefined ? 2 : 1,
    renderRight === null || renderRight !== undefined ? 4 : 5,
  ].join("/")

  return (
    <Flex flexFlow={"column"} alignItems={"normal"} bg={"black"} {...restProps}>
      {/* <Header /> */}
      {!!renderTop && <Box px={"224px"}>{renderTop}</Box>}
      <Grid px={"224px"} templateColumns={"repeat(4, .5fr)"} w={"full"}>
        {!!renderLeft && <Box>{renderLeft}</Box>}
        <Box gridColumn={outletContainerColumnSpan}>{children}</Box>
        {!!renderRight && <Box>{renderRight}</Box>}
      </Grid>
    </Flex>
  )
}
