import { IMulticall, Multicall } from "./multicall"
import { ITBTC, TBTC } from "./tbtc"
import { ThresholdConfig } from "./types"

export class Threshold {
  config!: ThresholdConfig
  multicall!: IMulticall
  tbtc!: ITBTC

  constructor(config: ThresholdConfig) {
    this._initialize(config)
  }

  private _initialize = (config: ThresholdConfig) => {
    this.config = config
    this.multicall = new Multicall(config.ethereum)
    this.tbtc = new TBTC(config.ethereum, config.bitcoin, this.multicall)
  }

  updateConfig = (config: ThresholdConfig) => {
    this._initialize(config)
  }
}
