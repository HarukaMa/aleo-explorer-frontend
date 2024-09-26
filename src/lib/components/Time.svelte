<script lang="ts">
  import { current_time_mode, format_time, format_time_utc, TimeMode } from "$lib/time_mode.svelte.js"

  const time_mode = current_time_mode()

  let {
    timestamp,
    flash = false,
    no_relative = false,
  }: { timestamp: number; flash?: boolean; no_relative?: boolean } = $props()

  let prev_timestamp = timestamp

  let date = $derived.by(() => {
    if (time_mode.value === TimeMode.Relative && no_relative) {
      return format_time_utc(new Date(timestamp * 1000))
    }
    return format_time(new Date(timestamp * 1000), time_mode.value)
  })

  let span: HTMLSpanElement

  $effect(() => {
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
