type Signal<T> = {
  (): T
  set(newValue: T): void
  set(setter: (prevValue: T) => T): void
  watch(fn: (value: T) => void): void
}


export const signal = <T>(value?: T) => {

  const listeners = new Set<Effect<T>>()

  const signal = function() {
    if (currEffect) {
      listeners.add(currEffect as Effect<T>)
    }
    return value
  }

  signal.set = (newValue: T | ((prevValue: T) => T)) => {
    const updated = newValue instanceof Function ? newValue(value!) : newValue
    if (value === updated) return
    else {
      value = updated
      for (const fn of listeners) fn(value)
    }
  }

  signal.watch = (fn: (value: T) => void) => {
    listeners.add(fn as Effect<T>)
  }

  return signal as Signal<T>
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
  effect(() => computed.set(fn()))
  return computed
}