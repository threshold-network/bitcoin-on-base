import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AccountState {
  address: string
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: "",
  } as AccountState,
  reducers: {
    walletConnected: (state: AccountState, action: PayloadAction<string>) => {
      state.address = action.payload
    },
  },
})

export const { walletConnected } = accountSlice.actions
