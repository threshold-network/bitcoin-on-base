import { FC } from "react"
import {
  Box,
  Flex,
  Image,
  Link,
  List,
  ListItem,
  StackProps,
  useMultiStyleConfig,
  Text,
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
> = ({ title, description, link, imageSrc = "", ...restProps }) => {
  const styles = useMultiStyleConfig("BridgeProcessResourcesItem", restProps)
  const isExpanded = restProps.variant === "expanded"
  return (
    <Box as={Link} isExternal href={link} sx={styles.container} {...restProps}>
      <Box sx={styles.label}>
        {title}
        <ExternalLinkIcon />
      </Box>
      {isExpanded && (
        <>
          {description && <Text sx={styles.description}>{description}</Text>}
          {imageSrc && <Image src={imageSrc} sx={styles.image} />}
        </>
      )}
    </Box>
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
