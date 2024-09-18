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

export function format_time_absolute_relative(seconds: number, past: boolean = true) {
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = days / 365
  if (!past) {
    if (seconds === 0) {
      return "immediately"
    } else if (seconds < 2) {
      return "in a second"
    } else if (seconds < 60) {
      return `in ${Math.floor(seconds)} seconds`
    } else if (minutes < 2) {
      return "in a minute"
    } else if (minutes < 60) {
      return `in ${Math.floor(minutes)} minutes`
    } else if (hours < 2) {
      return "in an hour"
    } else if (hours < 24) {
      return `in ${Math.floor(hours)} hours`
    } else if (days < 2) {
      return "tomorrow"
    } else if (days < 30) {
      return `in ${Math.floor(days)} days`
    } else if (months < 12) {
      return `in ${Math.floor(months)} months`
    } else if (years < 2) {
      return "next year"
    } else {
      return `in ${Math.floor(years)} years`
    }
  } else {
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
    } else if (days < 30) {
      return `${Math.floor(days)} days ago`
    } else if (months < 12) {
      return `${Math.floor(months)} months ago`
    } else if (years < 2) {
      return "last year"
    } else {
      return `${Math.floor(years)} years ago`
    }
  }
}

export function format_time_relative(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = diff / 1000
  return format_time_absolute_relative(seconds)
}
