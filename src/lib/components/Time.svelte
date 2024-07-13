<script lang="ts">

  import { current_time_mode, format_time, TimeMode } from "$lib/time_mode.svelte"

  const time_mode = current_time_mode()

  let { timestamp }: { timestamp: number } = $props()

  let prev_timestamp = timestamp

  let date = $derived(format_time(new Date(timestamp * 1000), time_mode.value))

  let span: HTMLSpanElement

  $effect(() => {
    if (time_mode.value == TimeMode.Relative) {
      span.classList.remove("tnum")
    } else {
      span.classList.add("tnum")
    }
  })
  $effect(() => {
    if (prev_timestamp !== timestamp) {
      prev_timestamp = timestamp
      span.classList.add("flash")
      setTimeout(() => {
        span.classList.remove("flash")
      }, 1000)
    }
  })


</script>

<span class="time" bind:this={span}>
  {date}
</span>