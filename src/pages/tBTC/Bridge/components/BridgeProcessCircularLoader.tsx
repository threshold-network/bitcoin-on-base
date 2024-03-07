import { BodyLg, Box, BoxProps } from "@threshold-network/components"
import { motion, Transition, Variants } from "framer-motion"
import { FC, SVGProps } from "react"
import { DotsLoadingIndicator } from "../../../../components/DotsLoadingIndicator"

type GetSvgCircleArcPropertiesType = (
  centerX: number,
  centerY: number,
  radius: number,
  progress: number
) => Pick<SVGProps<"path">, "d" | "cx" | "cy">

const wingAnimationTransition: Transition = {
  duration: 2.5,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
}
const leftWingAnimationVariants: Variants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: -24, opacity: 0.2 },
}
const rightWingAnimationVariants: Variants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: 24, opacity: 0.2 },
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  }
}

const getCircularSectorPathProperties: GetSvgCircleArcPropertiesType = (
  centerX,
  centerY,
  radius,
  progress
) => {
  const angleInDegrees = 360 * progress + 1

  const start = polarToCartesian(centerX, centerY, radius, angleInDegrees)
  const end = polarToCartesian(centerX, centerY, radius, 0)
  const isLargeArc = angleInDegrees <= 180

  return {
    d: `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${isLargeArc ? "0" : "1"} 0 ${end.x} ${end.y}
      L ${centerX} ${centerY}
      Z
    `,
    cx: centerX,
    cy: centerY,
  }
}

export type BridgeProcessCircularLoaderProps = BoxProps & {
  label: string
  progress?: number
}

export const BridgeProcessCircularLoader: FC<
  BridgeProcessCircularLoaderProps
> = ({ label, progress = 0.375, ...restProps }) => {
  return (
    <Box
      w="full"
      position="relative"
      _after={{
        content: "''",
        position: "absolute",
        inset: "0",
        w: "full",
        h: "full",
        rounded: "full",
        bg: "#03141A",
        filter: "blur(200px)",
        zIndex: 0,
      }}
      {...restProps}
    >
      <BodyLg
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        fontWeight="medium"
        color="white"
        zIndex={1}
      >
        {label}&nbsp;
        <DotsLoadingIndicator />
      </BodyLg>
      <Box
        as="svg"
        position="relative"
        zIndex={1}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="170 200 437 375"
      >
        <g mask="url(#b)">
          <circle cx="388" cy="388" r="140" fill="#fff" fillOpacity=".5" />
          <path
            fill="#66F9FF"
            fillRule="evenodd"
            {...getCircularSectorPathProperties(388, 388, 154, progress)}
          />
        </g>
        <motion.path
          // outer right wing
          variants={rightWingAnimationVariants}
          initial="initial"
          animate="animate"
          transition={wingAnimationTransition}
          stroke="url(#c)"
          d="M468 561.708c62.96-34.02 114-116.558 114-173.5 0-56.942-51.04-139.48-114-173.5"
          fill="none"
        />
        <motion.path
          // inner right wing
          variants={rightWingAnimationVariants}
          initial="initial"
          animate="animate"
          transition={wingAnimationTransition}
          stroke="url(#c)"
          d="M469 526c50.258-27.059 91-92.709 91-138s-40.742-110.941-91-138"
          fill="none"
        />
        <motion.path
          // outer left wing
          variants={leftWingAnimationVariants}
          initial="initial"
          animate="animate"
          transition={wingAnimationTransition}
          stroke="url(#d)"
          d="M308 561.708c-62.96-34.02-114-116.558-114-173.5 0-56.942 51.04-139.48 114-173.5"
          fill="none"
        />
        <motion.path
          // inner left wing
          variants={leftWingAnimationVariants}
          initial="initial"
          animate="animate"
          transition={wingAnimationTransition}
          stroke="url(#d)"
          d="M307 526c-50.258-27.059-91-92.709-91-138s40.742-110.941 91-138"
          fill="none"
        />
        <defs>
          <mask
            id="b"
            width="306"
            height="306"
            x="235"
            y="235"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
          >
            <circle
              cx="388"
              cy="388"
              r="121"
              stroke="#000"
              strokeDasharray="1.5 8"
              strokeDashoffset="759.88"
              strokeWidth="64"
              fill="none"
            />
          </mask>
          <linearGradient
            id="c"
            x1="582"
            x2="468"
            y1="388.208"
            y2="388.208"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="d"
            x1="194"
            x2="308"
            y1="388.208"
            y2="388.208"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </Box>
    </Box>
  )
}
