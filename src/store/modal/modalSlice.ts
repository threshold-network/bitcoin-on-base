import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ModalType } from "../../enums"

export interface ModalState {
  modalType: ModalType | null
  props: any
}

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalType: null,
    props: {},
  } as ModalState,
  reducers: {
    openModal: (
      state: ModalState,
      action: PayloadAction<{ modalType: ModalType; props?: any }>
    ) => {
      state.modalType = action.payload.modalType
      state.props = action.payload.props
    },
    closeModal: (state: ModalState) => {
      state.modalType = null
      state.props = {}
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
