import { MultiAppStaking } from "./mas"
import { IMulticall, Multicall } from "./multicall"
import { IStaking, Staking } from "./staking"
import { ITBTC, TBTC } from "./tbtc"
import { ThresholdConfig } from "./types"

export class Threshold {
  config!: ThresholdConfig
  multicall!: IMulticall
  staking!: IStaking
  multiAppStaking!: MultiAppStaking
  tbtc!: ITBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.config = config
    this.multicall = new Multicall(config.ethereum)
    this.staking = new Staking(config.ethereum, this.multicall)
    this.multiAppStaking = new MultiAppStaking(
      this.staking,
      this.multicall,
      config.ethereum
    )
    this.tbtc = new TBTC(config.ethereum, config.bitcoin, this.multicall)
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
