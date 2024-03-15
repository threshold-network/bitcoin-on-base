import { FC, ReactNode, useEffect } from "react"
import { Box, StackProps, VStack } from "@threshold-network/components"
import { ONE_SEC_IN_MILISECONDS } from "../../../../utils/date"
import { BridgeProcessIndicator } from "../../../../components/tBTC"
import { CircularLoader } from "../../../../components/CircularLoader"

export type BridgeProcessStepProps = {
  loaderLabel: string
  loaderProgress: number
  headingPrimary: ReactNode
  headingSecondary?: ReactNode
  isCompleted: boolean
  onComplete: () => void
} & StackProps

export const BridgeProcessStep: FC<BridgeProcessStepProps> = ({
  loaderLabel,
  loaderProgress,
  headingPrimary,
  headingSecondary,
  isCompleted,
  onComplete,
  ...restProps
}) => {
  useEffect(() => {
    if (!isCompleted) return

    const timeout = setTimeout(onComplete, 10 * ONE_SEC_IN_MILISECONDS)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCompleted, onComplete])

  return (
    <VStack spacing={10} {...restProps}>
      <CircularLoader label={loaderLabel} progress={loaderProgress} />
      <VStack spacing={4} zIndex={1}>
        <Box fontSize="md" lineHeight={6} color="hsl(182, 100%, 70%)">
          {headingPrimary}
        </Box>
        <BridgeProcessIndicator />
        {!!headingSecondary ? (
          <Box fontSize="md" color="hsla(0, 0%, 100%, 40%)" lineHeight={5}>
            {headingSecondary}
          </Box>
        ) : null}
      </VStack>
    </VStack>
  )
}
