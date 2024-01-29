import { EnvVariable } from "../enums"
import { getEnvVariable } from "../utils/getEnvVariable"

export const POSTHOG =
  getEnvVariable(EnvVariable.FEATURE_FLAG_POSTHOG) === "true" &&
  !window.location.href.includes("dashboard.test")

export const SENTRY = getEnvVariable(EnvVariable.FEATURE_FLAG_SENTRY) === "true"

export const LEDGER_LIVE =
  getEnvVariable(EnvVariable.FEATURE_FLAG_LEDGER_LIVE) === "true"
