type Nullish = null | undefined
type Primitive = string | number | boolean


declare namespace JSX {

  // necessary types

  type IntrinsicElements = Record<Tag, Attributes>

  type ElementType = Function | Tag | Nullish


  // supportive types

  type TagName = keyof HTMLElementTagNameMap

  type Tag = TagName | (string & {})

  type Attributes = Record<string, Function | Primitive | Record<string, any> | Nullish> | Nullish


  type Children = Nullish | Primitive | HTMLElement | DocumentFragment | Children[]

  type Component<A extends Attributes = undefined> = (attributes: A, ...children: Children[]) => Element

  type Element<T extends ElementType = string> =
    T extends Function ? ReturnType<T> :
    T extends TagName  ? HTMLElementTagNameMap[T] :
    T extends string   ? HTMLElement :
    DocumentFragment

}
