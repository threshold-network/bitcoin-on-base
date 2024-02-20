import { FC } from "react"
import { Box, StackProps, HStack } from "@threshold-network/components"
import { motion } from "framer-motion"

const LoadingDot: FC = () => (
  <motion.div
    variants={{
      initial: {
        y: "50%",
        opacity: 0.85,
      },
      animate: {
        y: "-50%",
        opacity: 0,
      },
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  >
    <Box w={1} h={1} rounded="full" bg="white" />
  </motion.div>
)

export const DotsLoadingIndicator: FC<StackProps> = (props) => (
  <HStack
    display="inline-flex"
    spacing={0.5}
    w={5}
    h={5}
    as={motion.div}
    variants={{
      initial: {
        transition: {
          staggerChildren: 0.2,
        },
      },
      animate: {
        transition: {
          staggerChildren: 0.2,
        },
      },
    }}
    initial="initial"
    animate="animate"
    {...props}
  >
    <LoadingDot />
    <LoadingDot />
    <LoadingDot />
  </HStack>
)
