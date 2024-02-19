import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  BodyLg,
  H5,
  BodySm,
  Flex,
  Image,
} from "@threshold-network/components"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBannerWithGrid.svg"
import { BaseModalProps } from "../../../types"
import ButtonLink from "../../ButtonLink"
import { TakeNoteList } from "../../tBTC"
import withBaseModal from "../withBaseModal"

const NewTBTCAppBase: FC<BaseModalProps> = ({ closeModal }) => {
  const { accept } = useTBTCTerms()

  return (
    <>
      <ModalBody>
        <Image
          src={tbtcAppBannerIllustration}
          maxH={{ base: "140px", xl: "unset" }}
          mx="auto"
          mb="14"
        />
        <H5 mb="2">The NEW tBTC dApp is here!</H5>
        <BodyLg mb="12" color="gray.500">
          Take note of the following before you proceed.
        </BodyLg>
        <Flex justifyContent="center" px="10">
          <TakeNoteList size="sm" />
        </Flex>
        <BodySm mt="4.5rem" px="4" textAlign="center" color="gray.500">
          By clicking the button below, you acknowledge and accept the above
          terms.
        </BodySm>
        <Divider mt="2" />
      </ModalBody>
      <ModalFooter gap="4">
        <ButtonLink
          variant="outline"
          to="/tBTC/how-it-works"
          onClick={() => {
            closeModal()
          }}
        >
          How it Works
        </ButtonLink>
        <Button
          onClick={() => {
            accept()
            closeModal()
          }}
          data-ph-capture-attribute-button-name={`I Agree, Let's Go! (New tBTC app)`}
        >
          I Agree, Let's Go!
        </Button>
      </ModalFooter>
    </>
  )
}

export const NewTBTCApp = withBaseModal(NewTBTCAppBase)
