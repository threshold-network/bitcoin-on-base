import { FC } from "react"
import { BodyMd, HStack, Skeleton } from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { BridgeProcessStepProps, BridgeProcessStep } from "./BridgeProcessStep"

const BitcoinConfirmationsSummary: FC<{
  minConfirmationsNeeded?: number
  txConfirmations?: number
}> = ({ minConfirmationsNeeded, txConfirmations }) => {
  return (
    <HStack spacing={2}>
      <CheckCircleIcon w={5} h={5} color="hsl(151, 100%, 70%)" />
      <BodyMd color="hsla(0, 0%, 100%, 40%)" lineHeight={5}>
        <Skeleton
          as="span"
          isLoaded={txConfirmations !== undefined}
          display="inline-block"
        >
          {txConfirmations! > minConfirmationsNeeded!
            ? minConfirmationsNeeded
            : txConfirmations}
          {"/"}
          {minConfirmationsNeeded}
        </Skeleton>
        &nbsp;Bitcoin Network Confirmations
      </BodyMd>
    </HStack>
  )
}

type CommonStepProps = Pick<BridgeProcessStepProps, "onComplete"> & {
  txHash?: string
}

export const Step1: FC<
  { confirmations?: number; requiredConfirmations?: number } & CommonStepProps
> = ({ confirmations, requiredConfirmations, onComplete }) => {
  const hasConfirmations = !!confirmations && !!requiredConfirmations
  return (
    <BridgeProcessStep
      loaderLabel="Minting"
      loaderProgress={
        0.25 * (hasConfirmations ? confirmations / requiredConfirmations : 1)
      }
      headingPrimary="Waiting for the Bitcoin Network Confirmations..."
      headingSecondary={
        <BitcoinConfirmationsSummary
          minConfirmationsNeeded={requiredConfirmations}
          txConfirmations={confirmations}
        />
      }
      isCompleted={Boolean(
        confirmations &&
          requiredConfirmations &&
          confirmations >= requiredConfirmations
      )}
      onComplete={onComplete}
    />
  )
}

export const Step2: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      loaderLabel="Minting"
      loaderProgress={0.25}
      headingPrimary="Minter Check"
      isCompleted={!!txHash}
      onComplete={onComplete}
    />
  )
}

export const Step3: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      loaderLabel="Minting"
      loaderProgress={0.5}
      headingPrimary="Guardian Check"
      headingSecondary={!!txHash ? "Transaction received" : "No transaction"}
      isCompleted={!!txHash}
      onComplete={onComplete}
    />
  )
}

export const Step4: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      loaderLabel="Minting"
      loaderProgress={0.75}
      headingPrimary="Token emission in progress"
      headingSecondary="The contract is sending your tBTC tokens."
      isCompleted={true}
      onComplete={onComplete}
    />
  )
}
