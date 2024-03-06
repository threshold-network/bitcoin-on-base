import { FC, useRef } from "react"
import {
  BodyMd,
  BodySm,
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
import {
  BTCConfirmationsIcon,
  GuardianCheckIcon,
  MintingCompletedIcon,
  MintingInitializedIcon,
} from "./DepositDetailsStepIcons"
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
  const areConfirmationsLoaded = txConfirmations !== undefined
  const checkmarkColor =
    txConfirmations &&
    minConfirmationsNeeded &&
    txConfirmations >= minConfirmationsNeeded
      ? "brand.500"
      : "gray.500"

  return (
    <HStack mt={8}>
      <CheckCircleIcon w={4} h={4} color={checkmarkColor} />{" "}
      <BodySm color={"gray.500"}>
        <Skeleton
          as="span"
          isLoaded={areConfirmationsLoaded}
          display="inline-block"
        >
          {txConfirmations! > minConfirmationsNeeded!
            ? minConfirmationsNeeded
            : txConfirmations}
          {"/"}
          {minConfirmationsNeeded}
        </Skeleton>
        {"  Bitcoin Network Confirmations"}
      </BodySm>
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

export const Step1: FC<
  { confirmations?: number; requiredConfirmations?: number } & Pick<
    BridgeProcessStepProps,
    "txHash" | "onComplete"
  >
> = ({ confirmations, requiredConfirmations, txHash, onComplete }) => {
  const subtitle = `Your Bitcoin deposit transaction requires ${requiredConfirmations} confirmation${
    requiredConfirmations !== undefined && requiredConfirmations > 1 ? "s" : ""
  } on the Bitcoin Network before initiating the minting process.`

  return (
    <BridgeProcessStep
      title="Waiting for the Bitcoin Network Confirmations..."
      chain="bitcoin"
      txHash={txHash}
      icon={<BTCConfirmationsIcon />}
      progressBarColor="brand.500"
      progressBarValue={confirmations}
      progressBarMaxValue={requiredConfirmations}
      isCompleted={Boolean(
        confirmations &&
          requiredConfirmations &&
          confirmations >= requiredConfirmations
      )}
      onComplete={onComplete}
    >
      <BitcoinConfirmationsSummary
        minConfirmationsNeeded={requiredConfirmations}
        txConfirmations={confirmations}
      />
      <BodyMd mt="6" px="3.5" alignSelf="flex-start">
        {subtitle}
      </BodyMd>
    </BridgeProcessStep>
  )
}

export const Step2: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Minting Initialized"
      icon={<MintingInitializedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="yellow.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    >
      <Box mt="6" px="3.5" alignSelf="flex-start">
        <BodyMd mb="9">
          A Minter is assessing the minting initialization. If all is well, the
          Minter will transfer the initialization to the Guardian.
        </BodyMd>
        <BodyMd>
          Minters are a small group of experts who monitor BTC deposits on the
          chain.
        </BodyMd>
      </Box>
    </BridgeProcessStep>
  )
}

export const Step3: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Guardian Check"
      icon={<GuardianCheckIcon />}
      chain="ethereum"
      progressBarColor="green.500"
      isCompleted={!!txHash}
      onComplete={onComplete}
      isIndeterminate
    >
      <Box mt="6" px="3.5" alignSelf="flex-start">
        <BodyMd mb="9">
          A Guardian examines the minting request submitted by a Minter. If all
          is well, the contract proceeds to the minting stage.
        </BodyMd>
        <BodyMd>
          Guardians verify minting requests and cancel fraudulent mints and
          remove problematic minters.
        </BodyMd>
      </Box>
    </BridgeProcessStep>
  )
}

export const Step4: FC<CommonStepProps> = ({ txHash, onComplete }) => {
  return (
    <BridgeProcessStep
      title="Minting in progress"
      icon={<MintingCompletedIcon />}
      chain="ethereum"
      txHash={txHash}
      progressBarColor="teal.500"
      isCompleted={true}
      onComplete={onComplete}
      isIndeterminate
    >
      <BodyMd mt="6" px="3.5" alignSelf="flex-start">
        The contract is minting your tBTC tokens.
      </BodyMd>
    </BridgeProcessStep>
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
          <InlineTokenBalance
            pb={2}
            tokenAmount={amount}
            higherPrecision={6}
            tokenSymbol="tBTC"
            color="white"
            fontSize="4.5xl"
            lineHeight={12}
            fontWeight="black"
          />
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
