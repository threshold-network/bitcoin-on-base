import { FC } from "react"
import { Alert, AlertIcon, AlertTitle } from "@threshold-network/components"
import { BsShieldCheck as CheckIcon } from "react-icons/bs"
const AccountSuccessAlert: FC<{ message: string }> = ({ message }) => {
  return (
    <Alert status="success">
      <AlertIcon as={CheckIcon} />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  )
}

export default AccountSuccessAlert
