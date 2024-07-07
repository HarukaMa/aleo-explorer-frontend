import type { APIBase } from "$lib/server/api/base"

export function is_empty(obj: NonNullable<unknown>) {
  return Object.keys(obj).length === 0
}

type GConstructor<T = object> = new (...args: never[]) => T

export type APIBaseMixin = GConstructor<APIBase>
