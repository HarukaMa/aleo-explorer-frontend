<script lang="ts">

  import type { Snippet } from "svelte"

  interface DetailLine {
    label: string
    children: Snippet
    tooltip?: string
  }

  let { label, children, tooltip }: DetailLine = $props()

</script>

<style lang="scss">

  @import "static/styles/variables";

  .line {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .left {
    display: flex;
    gap: 0.25rem;
    width: 12.5rem;
    align-items: center;
  }

  .label {
    color: $grey-600;
    font-size: 0.875rem;
  }

  .tooltip {
    width: 16px;
    height: 16px;
    background-image: $info-icon;
  }

</style>

<div class="line">
  <div class="left">
    <div class="label">{label}</div>
    {#if tooltip}
      <div class="tooltip" title={tooltip}></div>
    {/if}
  </div>
  <div class="right">
    {@render children()}
  </div>
</div>