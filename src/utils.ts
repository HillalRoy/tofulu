

export function randomInt(min: number, max: number | undefined = undefined): number {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number = 18,
  ): (...args: Params) => void {
    let timer: number

    return (...args: Params) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func(...args)
      }, timeout)
    }
  }