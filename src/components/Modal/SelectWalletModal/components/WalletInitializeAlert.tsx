import { FC } from "react"
import { Alert, AlertTitle, AlertIcon } from "@threshold-network/components"
import { DotsLoadingIndicator } from "../../../DotsLoadingIndicator"

const WalletInitializeAlert: FC = () => {
  return (
    <Alert>
      <AlertIcon as={DotsLoadingIndicator} />
      <AlertTitle>Initializing wallet connection...</AlertTitle>
    </Alert>
  )
}

export default WalletInitializeAlert
