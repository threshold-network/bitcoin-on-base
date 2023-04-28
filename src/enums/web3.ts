export enum ChainID {
  Ethereum = 1,
  Goerli = 5,
  Localhost = 1337,
}

export enum LedgerConnectionStage {
  SelectDerivation = "SELECT_DERIVATION",
  SelectAddress = "SELECT_ADDRESS",
  ConfirmSuccess = "CONFIRM_SUCCESS",
}

export enum TrezorConnectionStage {
  InitializeTrezorConnection = "INITIALIZE_TREZOR_CONNECTION",
  SelectAddress = "SELECT_ADDRESS",
  ConfirmSuccess = "CONFIRM_SUCCESS",
}

export enum ConnectionError {
  MetamaskNotInstalled = "No Ethereum provider was found on window.ethereum",
  RejectedMetamaskConnection = "The user rejected the request.",
  RejectedCoinbaseConnection = "User denied account authorization",
  CoinbaseUnsupportedNetwork = "Unsupported chain id:",
}

export enum WalletType {
  TAHO = "TAHO",
  Metamask = "METAMASK",
  WalletConnect = "WALLET_CONNECT",
  Coinbase = "COINBASE",
}
