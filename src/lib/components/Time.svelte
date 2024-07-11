<script lang="ts">

  import { current_time_mode, format_time, TimeMode } from "$lib/time_mode.svelte"

  const time_mode = current_time_mode()

  let { timestamp }: { timestamp: number } = $props()

  let date = $derived(format_time(new Date(timestamp * 1000), time_mode.value))

  let span: HTMLSpanElement

  $effect(() => {
    if (time_mode.value == TimeMode.Relative) {
      span.classList.remove("tnum")
    } else {
      span.classList.add("tnum")
    }
  })


</script>

<span class="time" bind:this={span}>
  {date}
</span>