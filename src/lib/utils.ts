import type { APIBase } from "$lib/server/api/base"

export function is_empty(obj: NonNullable<unknown>) {
  return Object.keys(obj).length === 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GConstructor<T = object> = new (...args: any[]) => T

export type APIBaseMixin = GConstructor<APIBase>

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}
