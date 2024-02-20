type Signal<T = any> = {
  (): T
  set(newValue: T): void
  set(setter: (prevValue: T) => T): void
}


declare namespace JSX {
  type Nullish = null | undefined
  type Primitive = string | number | boolean


  // necessary types (elements) for jsx transpiler

  type IntrinsicElements = {
    [T in Tag]: T extends HTMLTag ? Partial<ElementAttributes<T>> : Record<string, any>
  }

  type ElementType = Component<any, any> | Tag | Nullish


  // Element

  type Tag = HTMLTag | (string & {})

  type HTMLTag = keyof HTMLElementTagNameMap

  type ElementAttributes<T extends HTMLTag> = {
    [key: string]: any
    ref: { current: HTMLElementTagNameMap[T] } | ((node: HTMLElementTagNameMap[T]) => void)
    style: Record<string, string> | Nullish | false
  } & {
    [A in Extract<keyof HTMLElementTagNameMap[T], `on${string}`>]: HTMLElementTagNameMap[T][A]
  }


  // Component

  type Children = Nullish | Primitive | Signal | HTMLElement | DocumentFragment | Children[]

  type ComponentAttributes = Record<string, Function | Signal | Record<string, any> | Primitive | Nullish> | Nullish

  type Component<A extends ComponentAttributes = {}, T extends Tag | Nullish = string> = (attributes: A, ...children: Children[]) => Element<T>


  // Output Element

  type Element<T extends ElementType = string> =
    T extends Component<any, any> ? ReturnType<T> :
    T extends Nullish | ''        ? DocumentFragment :
    T extends HTMLTag             ? HTMLElementTagNameMap[T] :
    HTMLElement    

}
