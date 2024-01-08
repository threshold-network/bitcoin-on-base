import { useDispatch, useSelector } from "react-redux"
import { UseModal } from "../types"
import {
  closeModal as closeModalAction,
  openModal as openModalAction,
  successfullLoginModalClosed,
} from "../store/modal"
import { RootState } from "../store"
import { ModalType } from "../enums"
import { PosthogEvent } from "../types/posthog"
import { useCapture } from "./posthog"

export const useModal: UseModal = () => {
  const modalType = useSelector((state: RootState) => state.modal.modalType)
  const modalProps = useSelector((state: RootState) => state.modal.props)
  const captureModalCloseEvent = useCapture(PosthogEvent.ClosedModal)
  const dispatch = useDispatch()

  const openModal = (modalType: ModalType, props: any) =>
    dispatch(openModalAction({ modalType, props }))

  const closeModal = () => {
    captureModalCloseEvent({ modalType })
    dispatch(closeModalAction())
    if (modalType === ModalType.SelectWallet) {
      dispatch(successfullLoginModalClosed())
    }
  }

  return {
    modalType,
    modalProps,
    openModal,
    closeModal,
  }
}
