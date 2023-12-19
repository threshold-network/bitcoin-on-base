import { FC } from "react"
import {
  BodyMd,
  BodySm,
  Box,
  Flex,
  H6,
  HStack,
  Image,
  Link,
  List,
  ListItem,
  StackProps,
  VStack,
} from "@threshold-network/components"
import { TbExternalLink as ExternalLinkIcon } from "react-icons/tb"

export type BridgeProcessResourcesProps = {
  items: BridgeProcessResourcesItemProps[]
}

export type BridgeProcessResourcesItemProps = StackProps & {
  title: string
  description?: string
  link: string
  imageSrc?: string
  variant?: "folded" | "expanded"
}

export const BridgeProcessResourcesItem: FC<
  BridgeProcessResourcesItemProps
> = ({
  title,
  description,
  link,
  imageSrc = "",
  variant = "folded",
  ...restProps
}) => {
  return (
    <VStack
      as={Link}
      isExternal
      href={link}
      spacing="3"
      align="stretch"
      px="4"
      py={variant === "expanded" ? 4 : 2}
      my={variant === "expanded" ? 3 : 0}
      rounded="2xl"
      border={variant === "folded" ? "1px solid #1E1E1E" : undefined}
      bg={variant === "expanded" ? "#1E1E1E" : undefined}
      _hover={{
        textDecoration: "none",
        bg: variant === "expanded" ? "#2D2D2D" : "#1E1E1E",
      }}
      {...restProps}
    >
      <HStack justify="space-between">
        <BodySm color="white" fontWeight="bold">
          {title}
        </BodySm>
        <ExternalLinkIcon size={16} color="#66F9FF" />
      </HStack>
      {variant === "expanded" && (
        <>
          {description && <BodySm>{description}</BodySm>}
          {imageSrc && <Image src={imageSrc} mx="auto" rounded="lg" />}
        </>
      )}
    </VStack>
  )
}

export const BridgeProcessResources: FC<BridgeProcessResourcesProps> = ({
  items,
  ...restProps
}) => (
  <Flex as={List} flexFlow="column" gap="3" {...restProps}>
    {items.map((item, index) => (
      <ListItem key={item.link}>
        <BridgeProcessResourcesItem
          {...item}
          mt={index === 0 ? 0 : undefined}
          mb={index === items.length - 1 ? 0 : undefined}
        />
      </ListItem>
    ))}
  </Flex>
)
