export const isServer = typeof window == 'undefined'

export const debounce = (func, delay) => {
  let timer
  return function () {
    let self = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(self, args)
    }, delay)
  }
}
