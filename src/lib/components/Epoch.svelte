<style lang="scss">
  @import "/static/styles/variables";

  .epoch-progress {
    font-weight: 400;
    color: $grey-600;
  }
</style>

<script lang="ts">
  interface Epoch {
    height: number
  }

  let { height }: Epoch = $props()

  let last_height = height

  let epoch = $derived(Math.floor(height / 360))
  let epoch_progress = $derived(height % 360)

  let span: HTMLSpanElement
  $effect(() => {
    if (last_height !== height) {
      last_height = height
      span.classList.add("flash")
      setTimeout(() => {
        span.classList.remove("flash")
      }, 600)
    }
  })

</script>

<span class="epoch" bind:this={span}>
  {epoch}
  <span class="epoch-progress">
    ({epoch_progress}/360)
  </span>
</span>