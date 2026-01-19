<script lang="ts">
  import type { Snippet } from "svelte"
    import Tooltip from "./Tooltip.svelte"

  interface DetailLine {
    label: string
    children: Snippet
    tooltip?: string
  }

  let { label, children, tooltip }: DetailLine = $props()

  let showTooltip = $state(false)
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

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
    flex-shrink: 0;
  }

  .label {
    color: $grey-600;
    font-size: 0.875rem;
  }

  .tooltip-trigger {
    position: relative;
    display: flex;
    align-items: center;
    cursor: help;
  }

  .tooltip-icon {
    width: 16px;
    height: 16px;
    background-image: $info-icon;
  }

  @media (max-width: 768px) {
    .line {
      flex-direction: column;
      gap: 0.25rem;
      margin: 0.25rem 0;
    }

    .right {
      word-break: break-all;
      overflow-wrap: break-word;
    }
  }
</style>

<div class="line">
  <div class="left">
    {#if tooltip}
      <div class="tooltip-trigger">
        <Tooltip>
          <div class="tooltip-icon"></div>
          {#snippet tooltip_snippet()}
            {tooltip}
          {/snippet}
        </Tooltip>
      </div>
    {/if}
    <div class="label">{label}</div>
  </div>
  <div class="right">
    {@render children()}
  </div>
</div>
