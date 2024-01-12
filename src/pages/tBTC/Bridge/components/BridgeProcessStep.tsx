import { FC, ReactNode, useEffect } from "react"
import { BodyMd, StackProps, VStack } from "@threshold-network/components"
import { ONE_SEC_IN_MILISECONDS } from "../../../../utils/date"
import { BridgeProcessIndicator } from "../../../../components/tBTC"
import { BridgeProcessCircularLoader } from "./BridgeProcessCircularLoader"

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
      <BridgeProcessCircularLoader
        label={loaderLabel}
        progress={loaderProgress}
      />
      <VStack spacing={4} zIndex={1}>
        <BodyMd color="hsl(182, 100%, 70%)">{headingPrimary}</BodyMd>
        <BridgeProcessIndicator />
        {!!headingSecondary ? (
          <BodyMd color="hsla(0, 0%, 100%, 40%)" lineHeight={5}>
            {headingSecondary}
          </BodyMd>
        ) : null}
      </VStack>
    </VStack>
  )
}
