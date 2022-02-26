class Utils {
  get id(): string {
    return Math.random().toString(16).slice(2)
  }
  rnd(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

export const utils = new Utils()