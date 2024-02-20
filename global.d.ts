type Tuple<T, N extends number, A = []> = A['length'] extends N ? A : Tuple<T, N, [T, ...A]>
type Nullish = null | undefined
type Primitive = string | number | boolean
type ibool = 0 | 1
