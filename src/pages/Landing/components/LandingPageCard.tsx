import {
  Flex,
  Icon,
  Link,
  LinkProps,
  SystemStyleObject,
  Text,
  VStack,
  keyframes,
  position,
} from "@chakra-ui/react"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { CSSProperties, FC, MouseEventHandler } from "react"
import { HiOutlineArrowRight as ArrowIcon } from "react-icons/hi"

const arrowAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    transform: translateX(100%);
    opacity: 0;
  }
  51% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`

const arrowIconInteractionStyles: SystemStyleObject = {
  path: { animation: `${arrowAnimation} 0.45s ease-in-out` },
}

export interface LandingPageCardProps extends LinkProps {
  label: string
  title: string
  href: string
}
const LandingPageCard: FC<LandingPageCardProps> = ({
  label,
  title,
  href,
  children,
  ...restProps
}) => {
  const factorX = useMotionValue(0)
  const factorY = useMotionValue(0)
  const glareX = useMotionValue(0)
  const glareY = useMotionValue(0)
  const rotateX = useTransform(factorY, [-0.5, 0.5], ["-8deg", "8deg"])
  const rotateY = useTransform(factorX, [-0.5, 0.5], ["8deg", "-8deg"])

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newMouseX = e.clientX - rect.x
    const newMouseY = e.clientY - rect.y
    const newFactorX = newMouseX / rect.width - 0.5
    const newFactorY = newMouseY / rect.height - 0.5

    glareX.set(newMouseX)
    glareY.set(newMouseY)
    factorX.set(newFactorX)
    factorY.set(newFactorY)
  }

  const handleMouseLeave: MouseEventHandler<HTMLAnchorElement> = () => {
    animate(factorX, 0)
    animate(factorY, 0)
  }

  return (
    <Link
      as={motion.a}
      href={href}
      style={
        {
          rotateX,
          rotateY,
          "--glare-x": glareX,
          "--glare-y": glareY,
          transformStyle: "preserve-3d",
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      _hover={{
        textDecoration: "none",
        _before: {
          opacity: 1,
        },
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      rounded="2xl"
      border="1px"
      borderColor="whiteAlpha.250"
      bgColor="blackAlpha.400"
      overflow="hidden"
      data-group
      position="relative"
      _before={{
        content: '" "',
        position: "absolute",
        inset: 0,
        w: 96,
        h: 96,
        rounded: "full",
        bg: "whiteAlpha.300",
        filter: "auto",
        blur: "48px",
        opacity: 0,
        mixBlendMode: "soft-light",
        transition: "opacity 0.25s ease-in-out",
        transform:
          "translate(calc(var(--glare-x) * 1px - 50%), calc(var(--glare-y) * 1px - 50%))",
      }}
      {...restProps}
    >
      <Flex
        p={12}
        pb={20}
        bgGradient="linear(to bottom, whiteAlpha.200, transparent)"
      >
        <VStack spacing={4} align="flex-start" lineHeight="shorter">
          <Text fontWeight="medium" textTransform="uppercase" color="brand.100">
            {label}
          </Text>
          <Text fontFamily="accent" fontSize="3.5xl">
            {title}
          </Text>
        </VStack>
        <Icon
          as={ArrowIcon}
          color="brand.100"
          w={14}
          h={14}
          p={4}
          rounded="2xl"
          border="1px"
          borderColor="inherit"
          ml="auto"
          mr={-6}
          mt={-6}
          _groupHover={arrowIconInteractionStyles}
          _groupFocusVisible={arrowIconInteractionStyles}
        />
      </Flex>
      {children}
    </Link>
  )
}

export default LandingPageCard
