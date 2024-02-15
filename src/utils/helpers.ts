export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const randomRange = (min: number, max: number) =>
  min + Math.random() * (max - min)
