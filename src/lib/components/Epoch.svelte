<style lang="scss">
  @import "/static/styles/variables";

  .epoch-progress {
    font-size: 0.75rem;
    color: $grey-400;
  }
</style>

<script lang="ts">
  interface Epoch {
    height: number
  }

  let { height }: Epoch = $props()

  let epoch = $derived(Math.floor(height / 360))
  let epoch_progress = $derived(height % 360)

</script>

<span class="epoch tnum">
  {epoch}
  <span class="epoch-progress">
    ({epoch_progress}/360)
  </span>
</span>