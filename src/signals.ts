import { isFunction } from "./utils"

const signalIdentifier: unique symbol = Symbol()
const define = Object.defineProperty


export const signal = <T>(value?: T) => {

  const listeners = new Set<Effect<T>>()

  const signal = () => {
    if (currEffect) {
      listeners.add(currEffect as Effect<T>)
    }
    return value
  }

  define(signal, signalIdentifier, {})

  signal.set = (newValue: T | ((prevValue: T) => T)) => {
    const updated = isFunction(newValue) ? newValue(value!) : newValue
    if (value === updated) return
    else {
      value = updated
      for (const fn of listeners) fn(value)
    }
  }

  return signal as Signal<T>
}

define(signal, Symbol.hasInstance, { value(instance: any) { return signalIdentifier in instance }})


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