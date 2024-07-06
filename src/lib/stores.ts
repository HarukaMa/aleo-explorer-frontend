import { browser } from "$app/environment"
import { type Writable, writable } from "svelte/store"

export enum TimeMode {
  UTC,
  Local,
  Relative,
}

let time_display_value: TimeMode
if (browser) {
  // @ts-expect-error TS7015
  time_display_value = TimeMode[localStorage.getItem("time_display") || "UTC"]
} else {
  time_display_value = TimeMode.UTC
}

export const time_display: Writable<TimeMode> = writable(time_display_value)

let plausible_opt_out_value: boolean
if (browser) {
  plausible_opt_out_value = localStorage.getItem("plausible_opt_out") === "true"
} else {
  plausible_opt_out_value = false
}

export const plausible_opt_out: Writable<boolean> = writable(plausible_opt_out_value)

time_display.subscribe((value) => {
  if (!browser) return
  localStorage.setItem("time_display", TimeMode[value])
})
plausible_opt_out.subscribe((value) => {
  if (!browser) return
  localStorage.setItem("plausible_opt_out", value.toString())
})
