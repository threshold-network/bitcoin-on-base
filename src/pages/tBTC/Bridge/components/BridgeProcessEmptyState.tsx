import { FC } from "react"
import { Box, Text } from "@chakra-ui/react"
import SubmitTxButton from "../../../../components/SubmitTxButton"

import { BridgeProcess } from "../../../../types"
import { HiPlus as PlusIcon } from "react-icons/hi"

export const BridgeProcessEmptyState: FC<{
  title: string
  bridgeProcess?: BridgeProcess
}> = ({ title }) => {
  return (
    <Box
      position="relative"
      m={{ base: -6, lg: -10 }}
      px={{ base: 6, lg: 10, "2xl": 0 }}
      py={{ base: 6, lg: 10 }}
      _before={{
        content: "''",
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        bg: "hsl(196, 79%, 6%)",
        filter: "blur(200px)",
        w: "30rem", // 480px
        h: "full",
        maxH: "30rem", // 480px
        rounded: "full",
      }}
      _after={{
        content: "''",
        position: "absolute",
        right: 0,
        bottom: 0,
        w: "100vw",
        h: "1px",
        bg: "whiteAlpha.250",
      }}
      clipPath="polygon(-100% 0, 100% 0, 100% 100%, -100% 100%)"
    >
      <Text
        as="h1"
        fontSize="3.5xl"
        lineHeight={10}
        fontWeight="medium"
        mb={6}
        color="brand.100"
        position="relative"
        zIndex={1}
      >
        {title}
      </Text>
      <SubmitTxButton leftIcon={<PlusIcon />} m={0} />
    </Box>
  )
}
