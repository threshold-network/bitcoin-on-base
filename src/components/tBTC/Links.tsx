import { FC, ComponentProps, ReactElement } from "react"
import { useTBTCBridgeContractAddress } from "../../hooks/useTBTCBridgeContractAddress"
import { ExplorerDataType } from "../../utils/createEtherscanLink"
import ViewInBlockExplorer from "../ViewInBlockExplorer"
import { useTBTCTokenAddress } from "../../hooks/useTBTCTokenAddress"
import { LinkProps } from "../Link"

type Props = Omit<
  ComponentProps<typeof ViewInBlockExplorer>,
  "text" | "id" | "type"
> & {
  text?: string
} & Pick<LinkProps, "icon">

export const BridgeContractLink: FC<Props> = ({
  text = "Bridge Contract",
  ...props
}) => {
  const address = useTBTCBridgeContractAddress()
  return (
    <ViewInBlockExplorer
      id={address}
      type={ExplorerDataType.ADDRESS}
      text={text}
      {...props}
      data-ph-capture-attribute-button-name={`Bridge contract link (Deposit flow)`}
    />
  )
}

export const TBTCTokenContractLink: FC<Props> = ({
  text = "token address",
  ...props
}) => {
  const address = useTBTCTokenAddress()
  return (
    <ViewInBlockExplorer
      id={address}
      type={ExplorerDataType.ADDRESS}
      text={text}
      // to hide the icon
      icon={<></>}
      {...props}
    />
  )
}
