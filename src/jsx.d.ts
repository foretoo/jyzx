type Signal<T = any> = {
  (): T
  set(newValue: T): void
  set(setter: (prevValue: T) => T): void
}

type Nullish = null | undefined
type Primitive = string | number | boolean


declare namespace JSX {

  // necessary types (elements)

  type IntrinsicElements = {
    [T in Tag]: T extends TagName
                  ? Partial<ElementAttributeMap<T>>
                  : Record<string, any>
  }

  type ElementType = Component<any, any> | Tag | Nullish


  // Tag

  type Tag = TagName | (string & {})

  type TagName = keyof HTMLElementTagNameMap


  // Attributes

  type ElementAttributeMap<T extends TagName> = InnerAttributes<T> & EventHandlers<T> & {
    [key: (string & {})]: any
  }

  type EventHandlers<T extends TagName> = {
    [A in Extract<keyof HTMLElementTagNameMap[T], `on${string}`>]: HTMLElementTagNameMap[T][A]
  }

  type InnerAttributes<T extends TagName> = { ref: Ref<T>, style: Style }

  type Ref<T extends TagName> = { current: HTMLElementTagNameMap[T] } | ((node: HTMLElementTagNameMap[T]) => void)

  type Style = Record<string, string> | Nullish | false


  // Component

  type Children = Nullish | Primitive | Signal | HTMLElement | DocumentFragment | Children[]

  type Attributes = Record<string, Function | Signal | Record<string, any> | Primitive | Nullish> | Nullish

  type Component<A extends Attributes = {}, T extends Tag | Nullish = string> = (attributes: A, ...children: Children[]) => Element<T>

  type Element<T extends ElementType = string> =
    T extends Component<any, any> ? ReturnType<T> :
    T extends Nullish | ''        ? DocumentFragment :
    T extends TagName             ? HTMLElementTagNameMap[T] :
    HTMLUnknownElement    

}
