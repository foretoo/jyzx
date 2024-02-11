import { effect, signal } from "./signals"
import { isFunction, isNullish, isPrimitive } from "./utils"


type Effect = () => void
let index = 0
const effects: Effect[] = []


export const h = <T extends JSX.ElementType = undefined>(
  type?: T,
  attributes?: JSX.Attributes,
  ...children: JSX.Children[]
) => {
  const i = ++index

  if (isFunction(type)) {
    if (type.name === 'Fragment') {
      return Fragment(children) as JSX.Element<T>
    }
    const node = type(attributes, children)
    effects[i]?.()
    return node as JSX.Element<T>
  }

  if (!type) {
    return Fragment(children) as JSX.Element<T>
  }

  const node = document.createElement(type)
  traverseAttributes(node, attributes)
  traverseChildren(node, children)
  return node as JSX.Element<T>
}


export const Fragment = (children?: JSX.Children[]) => {
  const node = new DocumentFragment()
  traverseChildren(node, children)
  return node
}


export const useRef = <T = undefined>(value?: T): { current: T } => ({ current: value! })


export const useEffect = (fn: Effect) => effects[index] = fn



//// SIGNALS

const SignalElementTag = 'signal-element'

class SignalElement extends HTMLElement {}

customElements.define(SignalElementTag, SignalElement)

const isSignal = (value: unknown): value is Signal => (
  value instanceof signal
)



//////// TRAVERSE

const traverseAttributes = (node: HTMLElement, attributes: JSX.Attributes) => {
  if (!attributes) {
    return
  }

  const set = (key: string, value: string) => node.setAttribute(key, value)

  for (const [ key, value ] of Object.entries(attributes!)) {
    if (isNullish(value) || value === false) {
      continue
    }
    else if (value === true) {
      set(key, '')
    }
    else if (isPrimitive(value)) {
      set(key, `${value}`)
    }
    else if (isSignal(value)) {
      effect(() => set(key, value()))
    }
    else if (key === 'style') {
      set(key, Object.entries(value).map(([k,v])=>v?`${k}:${v};`:'').join(''))
    }
    else if (key === 'ref') {
      isFunction(value) ? value(node) : value.current = node
    }
    else if (isFunction(value)) {
      // @ts-ignore
      node[key] = value
    }
  }
}


const traverseChildren = (
  node: HTMLElement | DocumentFragment,
  children: JSX.Children[] = []
) => {

  const push = (item: Node) => node.appendChild(item)

  for (const child of children) {
    if (isNullish(child)) {
      continue
    }
    else if (isPrimitive(child)) {
      push(new Text(`${child}`))
    }
    else if (Array.isArray(child)) {
      traverseChildren(node, child)
    }
    else if (isSignal(child)) {
      const wrapper = document.createElement(SignalElementTag)
      effect(() => wrapper.replaceChildren(child()))
      push(wrapper)
    }
    else {
      push(child)
    }
  }
}
