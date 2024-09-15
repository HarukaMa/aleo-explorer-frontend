import type { APIError } from "$lib/types"
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

export function server_timing(
  setHeaders: (headers: Record<string, string>) => void,
  name: string,
  fn: (...args: unknown[]) => unknown | Promise<unknown>,
) {
  const start = performance.now()
  let result: unknown
  if (typeof performance === "function") {
    result = fn()
  } else {
  }
  setHeaders({ "Server-Timing": `${name};dur=${performance.now() - start}` })
  return result
}

export function app_error_from_api_error(err: APIError): App.Error {
  return { error: err.name, message: err.message }
}
