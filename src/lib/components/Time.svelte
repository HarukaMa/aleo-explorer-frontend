<script lang="ts">
  import {
    current_time_mode,
    format_time,
    format_time_relative,
    format_time_utc,
    TimeMode,
  } from "$lib/time_mode.svelte.js"

  const time_mode = current_time_mode()

  let {
    timestamp,
    flash = false,
    no_relative = false,
    relative = false,
  }: { timestamp: number; flash?: boolean; no_relative?: boolean; relative?: boolean } = $props()

  let prev_timestamp: number | undefined = $state()

  let date = $derived.by(() => {
    const value = new Date(timestamp * 1000)
    if (relative || (time_mode.value === TimeMode.Relative && !no_relative)) {
      return format_time_relative(value, new Date(time_mode.now))
    }
    if (time_mode.value === TimeMode.Relative) {
      return format_time_utc(value)
    }
    return format_time(value, time_mode.value)
  })

  let span: HTMLSpanElement

  $effect(() => {
    if (prev_timestamp === undefined) {
      prev_timestamp = timestamp
      return
    }
    if (flash && prev_timestamp !== timestamp) {
      prev_timestamp = timestamp
      span.classList.add("flash")
      setTimeout(() => {
        span.classList.remove("flash")
      }, 600)
    }
  })
</script>

<span class="time" bind:this={span}>
  {date}
</span>
