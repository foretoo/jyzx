type Signal<T> = {
  (): T
  (v: T): T
  (fn: (value: T) => T): T
  watch(fn: (value: T) => void): void
}


export const signal = <T>(value?: T) => {

  const listeners = new Set<Effect<T>>()

  const signal = function(newValue) {
    if (arguments.length) {
      const updated = newValue instanceof Function ? newValue(value!) : newValue
      if (value === updated) return
      else {
        value = updated
        for (const fn of listeners) fn(value)
      }
    } else if (currEffect) {
      listeners.add(currEffect as Effect<T>)
    }
    return value
  } as Signal<T>

  signal.watch = (fn: (value: T) => void) => {
    listeners.add(fn as Effect<T>)
  }

  return signal
}


// EFFECT

type Effect<T = undefined> = (value?: T) => void

let currEffect: Effect | undefined

export const effect = (fn: Effect) => {
	currEffect = fn
	fn()
	currEffect = undefined
}


// COMPUTED

export const compute = <T>(fn: () => T) => {
  const computed = signal<T>()
  effect(() => computed(fn()))
  return computed
}