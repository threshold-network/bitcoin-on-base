import { BlockTag, JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import {
  EthereumBridge,
  EthereumTBTCToken,
  EthereumTBTCVault,
  EthereumWalletRegistry,
  TBTCContracts,
} from "@keep-network/tbtc-v2.ts"
import { Contract, ContractInterface, Event, providers, Signer } from "ethers"
import { AddressZero, getAddress, isAddressZero } from "./address"

import BridgeArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/Bridge.json"
import TbtcTokenArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTC.json"
import TbtcVaultArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTCVault.json"
import WalletRegistryArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/WalletRegistry.json"

import BridgeArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/Bridge.json"
import TbtcTokenArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/TBTC.json"
import TbtcVaultArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/TBTCVault.json"
import WalletRegistryArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/WalletRegistry.json"

import BridgeArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/Bridge.json"
import TbtcTokenArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/TBTC.json"
import TbtcVaultArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/TBTCVault.json"
import WalletRegistryArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/WalletRegistry.json"

type ArtifactNameType = "Bridge" | "TBTCVault" | "TBTC" | "WalletRegistry"
type ArtifactType = {
  address: string
  abi: ContractInterface
  [key: string]: any
}

const mainnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactMainnet],
  ["TBTCVault", TbtcVaultArtifactMainnet],
  ["TBTC", TbtcTokenArtifactMainnet],
  ["WalletRegistry", WalletRegistryArtifactMainnet],
])
const testnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactSepolia],
  ["TBTCVault", TbtcVaultArtifactSepolia],
  ["TBTC", TbtcTokenArtifactSepolia],
  ["WalletRegistry", WalletRegistryArtifactSepolia],
])
const testnetDevelopmentArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactDappDevelopmentSepolia],
  ["TBTCVault", TbtcVaultArtifactDappDevelopmentSepolia],
  ["TBTC", TbtcTokenArtifactDappDevelopmentSepolia],
  ["WalletRegistry", WalletRegistryArtifactDappDevelopmentSepolia],
])

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export const getContract = (
  address: string,
  abi: ContractInterface,
  providerOrSigner: providers.Provider | Signer | undefined,
  account?: string
) => {
  if (!getAddress(address) || isAddressZero(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(
    address,
    abi,
    getProviderOrSigner(providerOrSigner as any, account) as any
  )
}

interface EventFilterOptions {
  fromBlock?: BlockTag
  toBlock?: BlockTag
  filterParams: any[]
  eventName: string
}

export const getContractPastEvents = async (
  contract: Contract,
  options: EventFilterOptions
): Promise<Array<Event>> => {
  const filter = contract.filters[options.eventName](...options.filterParams)

  return await contract.queryFilter(filter, options.fromBlock, options.toBlock)
}

export function getContractAddressFromTruffleArtifact(
  truffleArtifact: { networks: { [chainID: string]: { address: string } } },
  chainID: string | undefined = undefined
) {
  const networks = Object.keys(truffleArtifact.networks) as Array<
    keyof typeof truffleArtifact.networks
  >

  return networks && networks.length > 0
    ? (
        truffleArtifact.networks[chainID ? chainID : networks[0]] as {
          address: string
        }
      ).address
    : AddressZero
}

export const getArtifact = (
  artifactName: ArtifactNameType,
  chainId: string | number,
  shouldUseTestnetDevelopmentContracts = false
): ArtifactType => {
  switch (chainId.toString()) {
    case "1":
      return mainnetArtifacts.get(artifactName)!
    case "11155111":
      // Ethereum Sepolia testnet.
      const artifacts = shouldUseTestnetDevelopmentContracts
        ? testnetDevelopmentArtifacts
        : testnetArtifacts
      return artifacts.get(artifactName)!
    default:
      throw new Error("Can't get tbtc-v2 artifacts!")
  }
}

export const getSepoliaDevelopmentContracts = (
  signerOrProvider: Signer | providers.Provider
): TBTCContracts => {
  return {
    bridge: new EthereumBridge({
      address: BridgeArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    tbtcToken: new EthereumTBTCToken({
      address: TbtcTokenArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    tbtcVault: new EthereumTBTCVault({
      address: TbtcVaultArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    walletRegistry: new EthereumWalletRegistry({
      address: WalletRegistryArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
  }
}
