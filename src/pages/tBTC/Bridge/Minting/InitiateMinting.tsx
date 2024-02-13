import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { BodyMd, Box, Button } from "@threshold-network/components"
import { FC } from "react"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { ModalType } from "../../../../enums"
import { useModal } from "../../../../hooks/useModal"
import { MintingStep } from "../../../../types/tbtc"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"

const InitiateMintingComponent: FC<{
  utxo: BitcoinUtxo
  onPreviousStepClick: (previousStep?: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { openModal } = useModal()

  const confirmDespotAndMint = async () => {
    openModal(ModalType.TbtcMintingConfirmation, { utxo: utxo })
  }

  return (
    <Box mx={{ base: 0, lg: 10 }}>
      <BridgeProcessCardTitle
        onPreviousStepClick={onPreviousStepClick}
        step={3}
        title="Initiate minting"
      />
      <BodyMd color="gray.500" mb={6}>
        This step requires you to sign a transaction in your Ethereum wallet.
      </BodyMd>
      <BodyMd color="gray.500" mb={6}>
        Your tBTC will arrive in your wallet in around ~3 hours.
      </BodyMd>
      <Button
        onClick={confirmDespotAndMint}
        isFullWidth
        data-ph-capture-attribute-button-name={
          "Confirm deposit & mint (Step 2)"
        }
      >
        Initiate minting
      </Button>
    </Box>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
