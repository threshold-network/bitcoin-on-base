import {
  Flex,
  Icon,
  Link,
  LinkProps,
  SystemStyleObject,
  Text,
  VStack,
  keyframes,
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
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], ["6deg", "-6deg"])
  const rotateY = useTransform(x, [-0.5, 0.5], ["-6deg", "6deg"])

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.x
    const mouseY = e.clientY - rect.y

    const newX = mouseX / rect.width - 0.5
    const newY = mouseY / rect.height - 0.5
    x.set(newX)
    y.set(newY)
  }

  const handleMouseLeave: MouseEventHandler<HTMLAnchorElement> = () => {
    animate(x, 0)
    animate(y, 0)
  }

  return (
    <Link
      as={motion.a}
      href={href}
      style={
        { rotateX, rotateY, transformStyle: "preserve-3d" } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      _hover={{ textDecoration: "none" }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      rounded="2xl"
      border="1px"
      borderColor="whiteAlpha.250"
      bgColor="blackAlpha.400"
      overflow="hidden"
      backdropFilter="auto"
      backdropBlur="12px"
      data-group
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
