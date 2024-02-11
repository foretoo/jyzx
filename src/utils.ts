const primitiveTypes = [ 'string', 'number', 'boolean' ]
export const isPrimitive = (value: unknown): value is Primitive => (
  primitiveTypes.includes(typeof value)
)

export const isNullish = (value: unknown): value is Nullish => (
  value === null || value === undefined
)

export const isFunction = (value: unknown): value is Function => (
  value instanceof Function
)
