export const formatPercentage = (
  percentage: number,
  decimalPlaces = 0,
  displayLessThanGreaterThanSigns = false,
  displaySign = true
): string => {
  if (percentage < 1 && percentage > 0 && displayLessThanGreaterThanSigns) {
    return `<1${displaySign ? "%" : ""}`
  } else if (
    percentage > 99 &&
    percentage < 100 &&
    displayLessThanGreaterThanSigns
  ) {
    return `>99${displaySign ? "%" : ""}`
  }

  const roundedPercentage = percentage.toFixed(decimalPlaces)

  return `${roundedPercentage.toString()}${displaySign ? "%" : ""}`
}
