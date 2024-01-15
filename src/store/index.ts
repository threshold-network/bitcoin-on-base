import {
  configureStore,
  combineReducers,
  AnyAction,
  Reducer,
} from "@reduxjs/toolkit"
import { modalSlice } from "./modal"
import { tokenSlice } from "./tokens"
import { sidebarSlice } from "./sidebar"
import { tbtcSlice, registerTBTCListeners } from "./tbtc"
import { listenerMiddleware } from "./listener"
import { accountSlice } from "./account"

const combinedReducer = combineReducers({
  account: accountSlice.reducer,
  modal: modalSlice.reducer,
  token: tokenSlice.reducer,
  sidebar: sidebarSlice.reducer,
  tbtc: tbtcSlice.reducer,
})

const APP_RESET_STORE = "app/reset_store"

export const resetStoreAction = () => ({
  type: APP_RESET_STORE,
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === APP_RESET_STORE) {
    listenerMiddleware.clearListeners()
    registerTBTCListeners()
    state = {
      token: {
        TBTCV2: { ...state.token.TBTCV2, balance: 0 },
      },
    } as RootState
  }

  return combinedReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["modal/openModal"],
        // Ignore these field paths in all actions
        ignoredPaths: ["modal.props.onSubmit"],
      },
    }).prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<
  typeof store.getState & typeof combinedReducer
>
export type AppDispatch = typeof store.dispatch
export default store
