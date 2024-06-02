export function is_empty(obj: NonNullable<unknown>) {
  return Object.keys(obj).length === 0
}
