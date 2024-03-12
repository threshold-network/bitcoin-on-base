import { FC } from "react"
import { Box, BoxProps, Icon } from "@threshold-network/components"
import { BridgeProcess } from "../../types/tbtc"
import { motion } from "framer-motion"

export const BridgeProcessIndicator: FC<
  {
    bridgeProcess?: BridgeProcess
  } & Omit<BoxProps, "position">
> = ({ bridgeProcess, ...restProps }) => {
  // TODO: Replace inline icon SVGs with components
  return (
    <Box position="relative" {...restProps}>
      <Icon
        w="auto"
        h="full"
        viewBox="0 0 20 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        position="absolute"
        zIndex={1}
        left={1}
        p={3}
      >
        <path
          d="M19.8158 11.1506C20.2133 8.48937 18.1871 7.05875 15.4164 6.10437L16.3152 2.49937L14.1202 1.9525L13.2452 5.4625C12.6689 5.31875 12.0764 5.18312 11.4877 5.04875L12.3689 1.51562L10.1758 0.96875L9.27644 4.5725C8.79894 4.46375 8.33019 4.35625 7.87519 4.24312L7.8777 4.23188L4.85145 3.47625L4.26769 5.82C4.26769 5.82 5.89582 6.19312 5.86145 6.21625C6.7502 6.43812 6.91145 7.02625 6.88395 7.4925L5.8602 11.5994C5.92145 11.615 6.00082 11.6375 6.08832 11.6725L5.85707 11.615L4.42145 17.3681C4.3127 17.6381 4.03707 18.0431 3.41582 17.8894C3.4377 17.9212 1.82082 17.4912 1.82082 17.4912L0.731445 20.0037L3.5877 20.7156C4.11895 20.8487 4.63957 20.9881 5.15144 21.1194L4.24332 24.7662L6.43519 25.3131L7.3352 21.7056C7.93332 21.8681 8.51457 22.0181 9.08332 22.1594L8.18707 25.75L10.3814 26.2969L11.2896 22.6575C15.0314 23.3656 17.8458 23.08 19.0289 19.6962C19.9833 16.9712 18.9821 15.3994 17.0133 14.3737C18.4471 14.0419 19.5277 13.0987 19.8158 11.1506ZM14.8014 18.1812C14.1227 20.9062 9.5352 19.4337 8.04707 19.0637L9.25207 14.2331C10.7396 14.6044 15.5083 15.3394 14.8014 18.1812ZM15.4796 11.1112C14.8608 13.59 11.0421 12.3306 9.8027 12.0219L10.8952 7.64062C12.1346 7.94937 16.1246 8.52562 15.4796 11.1112Z"
          fill="white"
        />
      </Icon>
      <Icon
        w="auto"
        h="full"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        position="absolute"
        zIndex={1}
        right={0}
        p={3}
      >
        <path
          d="M14.9525 29.085C22.7311 29.085 29.037 22.7792 29.037 15.0005C29.037 7.22187 22.7311 0.916016 14.9525 0.916016C7.57301 0.916016 1.51904 6.59126 0.917126 13.8152H21.8175V16.1606H0.915039C1.50495 23.3966 7.56439 29.085 14.9525 29.085Z"
          fill="white"
        />
      </Icon>

      <Icon
        viewBox="0 0 121.7 10.6"
        w={{ base: "100%", md: "460px" }}
        height="auto"
        filter="url('#bridge-process-indicator-blur')"
        p={2}
      >
        <defs>
          <linearGradient id="bridge-process-indicator-gradient">
            <stop offset="0" style={{ stopColor: "#f7931a", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#0052ff", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="bridge-process-indicator-blur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="7.5"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26.5 -6"
              result="bridge-process-indicator-blur"
            />
            <feBlend in="SourceGraphic" in2="bridge-process-indicator-blur" />
          </filter>
        </defs>
        <path
          d="M36 53.6h96.3v.5H36z"
          style={{ opacity: 0.1, fill: "#fff" }}
          transform="translate(-23.3 -48.6)"
        />
        <path
          d="M138.8 59.1a5.5 5.5 0 0 1-4.4-4.3V53c.3-1 .8-2 1.5-2.8.8-.7 1.8-1.2 2.8-1.5h2a5.4 5.4 0 0 1 4.2 4.3v2a5.4 5.4 0 0 1-6 4.2z"
          style={{ fill: "#0052ff", fillOpacity: 1, strokeWidth: 0.0380466 }}
          transform="translate(-23.3 -48.6)"
        />
        <path
          d="M27.8 59.1a5.5 5.5 0 0 1-4.4-4.3V53a5.5 5.5 0 0 1 4.3-4.3h1.9a5.4 5.4 0 0 1 4.3 4.3v2a5.4 5.4 0 0 1-6.1 4.2z"
          style={{
            fill: "#f7931a",
          }}
          transform="translate(-23.3 -48.6)"
        />
        <motion.path
          // bitcoin dot
          initial={{
            x: -32,
            y: -48.6,
            scale: 1.65,
          }}
          animate={{
            x: 23.3,
            y: -48.6,
            scale: 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          d="M37.4 55.5a1.6 1.6 0 0 1-1.3-1.3v-.6c0-.3.2-.6.4-.8.2-.3.5-.4.8-.5h.6a1.6 1.6 0 0 1 1.3 1.3v.6a1.6 1.6 0 0 1-1.8 1.3z"
          style={{
            fill: "#f7931a",
          }}
        />
        <motion.path
          // base dot
          initial={{
            x: -23.35,
            y: -48.6,
            scale: 1,
          }}
          animate={{
            x: 33.4,
            y: -48.6,
            scale: 1.65,
          }}
          transition={{
            duration: 4,
            delay: 4,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 4,
            ease: "easeOut",
          }}
          d="M84 55.5a1.6 1.6 0 0 1-1.4-1.3v-.6c0-.3.2-.6.5-.8.2-.3.5-.4.8-.5h.6a1.6 1.6 0 0 1 1.3 1.3v.6a1.6 1.6 0 0 1-1.9 1.3z"
          style={{
            fill: "#0052ff",
          }}
        />
        <path
          d="M84 55.5a1.6 1.6 0 0 1-1.4-1.3v-.6c0-.3.2-.6.5-.8.2-.3.5-.4.8-.5h.6a1.6 1.6 0 0 1 1.3 1.3v.6a1.6 1.6 0 0 1-1.9 1.3z"
          style={{
            fill: "url(#bridge-process-indicator-gradient)",
          }}
          transform="translate(-23.3 -48.6)"
        />
      </Icon>
    </Box>
  )
}
