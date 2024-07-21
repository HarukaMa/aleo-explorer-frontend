<script lang="ts">

  import { current_time_mode, format_time } from "$lib/time_mode.svelte"

  const time_mode = current_time_mode()

  let { timestamp }: { timestamp: number } = $props()

  let prev_timestamp = timestamp

  let date = $derived(format_time(new Date(timestamp * 1000), time_mode.value))

  let span: HTMLSpanElement

  $effect(() => {
    if (prev_timestamp !== timestamp) {
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