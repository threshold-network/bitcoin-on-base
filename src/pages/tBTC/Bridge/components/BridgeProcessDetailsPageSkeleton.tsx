import { FC } from "react"
import {
  SkeletonText,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@threshold-network/components"

export const BridgeProcessDetailsPageSkeleton: FC = () => {
  return (
    <>
      <SkeletonText noOfLines={1} width="40%" skeletonHeight={6} mb="8" />
      <SkeletonCircle mt="8" size="320px" mx="auto" />
      <SkeletonText
        mt="8"
        mx="auto"
        w="80%"
        as={VStack}
        noOfLines={3}
        skeletonHeight={4}
      />
    </>
  )
}
