import { Button, ButtonProps } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { FC } from "react"
import { useIsTbtcSdkInitializing } from "../contexts/ThresholdContext"
import { ModalType } from "../enums"
import { useModal } from "../hooks/useModal"

interface Props extends ButtonProps {
  onSubmit?: () => void
  submitText?: string
}

const SubmitTxButton: FC<Props> = ({
  onSubmit,
  submitText = "Upgrade",
  ...buttonProps
}) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()
  const { isSdkInitializedWithSigner } = useIsTbtcSdkInitializing()

  if (active && isSdkInitializedWithSigner) {
    return (
      <Button mt={6} isFullWidth onClick={onSubmit} {...buttonProps}>
        {submitText}
      </Button>
    )
  }

  return (
    <Button
      mt={6}
      onClick={() => openModal(ModalType.SelectWallet)}
      {...buttonProps}
      type="button"
      isDisabled={false}
    >
      Connect Your Wallet
    </Button>
  )
}

export default SubmitTxButton
