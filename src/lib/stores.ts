import { type Writable, writable } from "svelte/store"

export const timezone_local: Writable<boolean> = writable(false)

export const plausible_opt_out: Writable<boolean> = writable(false)
if (typeof window !== "undefined") {
  if (window.localStorage.getItem("plausible_ignore") === "true") {
    plausible_opt_out.set(true)
  }
}
