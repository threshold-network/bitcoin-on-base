import { FC, useRef } from "react"
import {
  BodyMd,
  HStack,
  Skeleton,
  Box,
  List,
  VStack,
  Text,
  useDimensions,
  Flex,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { BridgeProcessStepProps, BridgeProcessStep } from "./BridgeProcessStep"
import ButtonLink from "../../../../components/ButtonLink"
import { TBTCTokenContractLink } from "../../../../components/tBTC"
import { TransactionDetailsAmountItem } from "../../../../components/TransactionDetails"
import Confetti from "react-confetti"
import { randomRange } from "../../../../utils/helpers"
import { InlineTokenBalance } from "../../../../components/TokenBalance"

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
        </Skeleton>{" "}
        Bitcoin Network Confirmations
      </BodyMd>
    </HStack>
  )
}

type CommonStepProps = Pick<BridgeProcessStepProps, "onComplete"> & {
  txHash?: string
}

type SuccessStepProps = {
  amount: string
  mintingFee?: string
  thresholdNetworkFee?: string
}

export const DepositDetailsStep1: FC<
  { confirmations?: number; requiredConfirmations?: number } & CommonStepProps
> = ({ confirmations, requiredConfirmations, onComplete }) => {
  const hasConfirmations = !!confirmations && !!requiredConfirmations

  return (
    <BridgeProcessStep
      loaderLabel="Minting"
      loaderProgress={
        hasConfirmations
          ? Math.min(0.25, 0.25 * (confirmations / requiredConfirmations))
          : 0
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

export const DepositDetailsStep2: FC<CommonStepProps> = ({
  txHash,
  onComplete,
}) => {
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

export const DepositDetailsStep3: FC<CommonStepProps> = ({
  txHash,
  onComplete,
}) => {
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

export const DepositDetailsStep4: FC<CommonStepProps> = ({
  txHash,
  onComplete,
}) => {
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

export const SuccessStep: FC<SuccessStepProps> = ({
  amount,
  mintingFee,
  thresholdNetworkFee,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef, true)

  return (
    <Box
      position="relative"
      ref={containerRef}
      m={{ base: -6, lg: -10 }}
      _after={{
        // this pseudoelement creates confetti fade out effect
        content: '""',
        position: "absolute",
        w: "full",
        h: "full",
        inset: 0,
        bgGradient: "linear(to bottom, transparent 25%, black 75%)",
      }}
    >
      <Flex
        align="stretch"
        direction="column"
        gap={10}
        px={{ base: 6, lg: 10, xl: 20 }}
        py={{ base: 6, lg: 10 }}
        position="relative"
        zIndex={1}
      >
        <Text
          fontSize="lg"
          lineHeight={6}
          fontWeight="medium"
          color="hsl(151, 100%, 70%)"
          align="center"
        >
          Mint completed
        </Text>
        <VStack>
          <Text fontSize="2xl" lineHeight={8} color="hsl(0, 0%, 50%)">
            You received
          </Text>
          <Text fontSize="4.5xl" lineHeight={12} color="hsl(0, 0%, 50%)">
            <InlineTokenBalance
              pb={2}
              tokenAmount={amount}
              higherPrecision={6}
              color="white"
              fontWeight="black"
            />
            &nbsp;tBTC
          </Text>
          <Text fontSize="md" lineHeight={6} color="white" align="center">
            Add the tBTC <TBTCTokenContractLink color="brand.100" /> to your
            Ethereum wallet.
          </Text>
        </VStack>
        <List spacing={4} py={10}>
          <TransactionDetailsAmountItem
            label="Minting Fee"
            tokenAmount={mintingFee}
            tokenSymbol="tBTC"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsAmountItem
            label="Threshold Network Fee"
            tokenAmount={thresholdNetworkFee}
            tokenSymbol="tBTC"
            precision={6}
            higherPrecision={8}
          />
        </List>
        <ButtonLink variant="outline" to="/tBTC" isFullWidth>
          Start a new mint
        </ButtonLink>
      </Flex>
      <Confetti
        style={{ zIndex: 0 }}
        width={dimensions?.borderBox.width}
        height={dimensions?.borderBox.height}
        numberOfPieces={150}
        gravity={0.05}
        drawShape={(ctx) => {
          // draw custom rectangular shapes with random sizes and opacity
          const width = randomRange(5, 20)
          const height = randomRange(5, 20)
          const opacity = randomRange(0.1, 1)
          ctx.filter = `opacity(${opacity})`
          ctx.fillRect(-width / 6, -height / 2, width / 3, height)
        }}
      />
    </Box>
  )
}
