import { getContext, hasContext, setContext } from "svelte"

export enum TimeMode {
  UTC,
  Local,
  Relative,
}

export const current_time_mode = (init?: TimeMode) => {
  let mode = $state(init)
  if (hasContext("time_mode")) {
    return getContext<{ value: TimeMode }>("time_mode")
  } else if (init === undefined) {
    throw new Error("No initial value provided")
  }
  const state = {
    get value() {
      return mode!
    },
    set value(value: TimeMode) {
      mode = value
    },
  }
  setContext("time_mode", state)
  return state
}

export function format_time(date: Date, mode: TimeMode) {
  switch (mode) {
    case TimeMode.UTC:
      return format_time_utc(date)
    case TimeMode.Local:
      return format_time_local(date)
    case TimeMode.Relative:
      return format_time_relative(date)
  }
}

export function format_time_utc(date: Date) {
  return date.toISOString().replace("T", " ").replace(".000Z", "")
}

export function format_time_local(date: Date) {
  const local_date = new Date(date)
  local_date.setMinutes(local_date.getMinutes() - local_date.getTimezoneOffset())
  return local_date.toISOString().replace("T", " ").replace(".000Z", "")
}

export function format_time_relative(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = days / 365

  if (seconds === 0) {
    return "just now"
  } else if (seconds < 2) {
    return "a second ago"
  } else if (seconds < 60) {
    return `${Math.floor(seconds)} seconds ago`
  } else if (minutes < 2) {
    return "a minute ago"
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} minutes ago`
  } else if (hours < 2) {
    return "an hour ago"
  } else if (hours < 24) {
    return `${Math.floor(hours)} hours ago`
  } else if (days < 2) {
    return "yesterday"
  } else if (days < 7) {
    return `${Math.floor(days)} days ago`
  } else if (months < 2) {
    return "last week"
  } else if (months < 12) {
    return `${Math.floor(months)} months ago`
  } else if (years < 2) {
    return "last year"
  } else {
    return `${Math.floor(years)} years ago`
  }
}
