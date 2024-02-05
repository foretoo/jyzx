/// <reference types="./jsx.d.ts" />


let index = 0
const effects: Function[] = []

export const h = <T extends JSX.ElementType = undefined>(
  type?: T,
  attributes?: JSX.Attributes,
  ...children: JSX.Children[]
) => {
  const i = ++index

  if (type instanceof Function) {
    const node = type(attributes, children)
    effects[i]?.()
    return node as JSX.Element<T>
  }

  if (!type) {
    return Fragment(attributes, children) as JSX.Element<T>
  }

  const node = document.createElement(type)
  traversAttributes(node, attributes)
  traversChildren(node, children)
  return node as JSX.Element<T>
}


export const Fragment = (_: JSX.Attributes, children: JSX.Children[]) => {
  const node = new DocumentFragment()
  traversChildren(node, children)
  return node
}


export const useRef = <T = undefined>(value?: T): { current: T } => ({ current: value! })


export const useEffect = (fn: Function) => effects[index] = fn



//////// HELPERS

const traversAttributes = (node: HTMLElement, attributes: JSX.Attributes) => {
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
    else if (key === 'style') {
      set(key, Object.entries(value).map(([k,v])=>v?`${k}:${v};`:'').join(''))
    }
    else if (key === 'ref') {
      value instanceof Function ? value(node) : value.current = node
    }
    else if (value instanceof Function) {
      // @ts-ignore
      node[key] = value
    }
  }
}


const traversChildren = (
  node: HTMLElement | DocumentFragment,
  children: JSX.Children[]
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
      traversChildren(node, child)
    }
    else {
      push(child)
    }
  }

  return node
}


const primitiveTypes = [ 'string', 'number', 'boolean' ]
const isPrimitive = (value: unknown): value is Primitive => (
  primitiveTypes.includes(typeof value)
)

const isNullish = (value: unknown): value is Nullish => (
  value === null || value === undefined
)
