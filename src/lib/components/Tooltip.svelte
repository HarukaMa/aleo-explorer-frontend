<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()

  let tooltipEl: HTMLDivElement
  let position: "top" | "right" | "bottom" | "left" = $state("top")

  $effect(() => {
    if (tooltipEl) {
      const rect = tooltipEl.getBoundingClientRect()
      const padding = 8

      if (rect.left < padding) {
        position = "right"
      } else if (rect.right > window.innerWidth - padding) {
        position = "left"
      } else if (rect.top < padding) {
        position = "bottom"
      } else {
        position = "top"
      }
    }
  })
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .tooltip {
    position: absolute;
    padding: 0.75rem 1rem;
    background-color: $grey-800;
    color: white;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: normal;
    z-index: 100;
    width: max-content;
    max-width: 15rem;

    &::after {
      content: "";
      position: absolute;
      border: 0.5rem solid transparent;
    }

    &.top {
      bottom: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%);

      &::after {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: $grey-800;
      }
    }

    &.bottom {
      top: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%);

      &::after {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: $grey-800;
      }
    }

    &.right {
      left: calc(100% + 0.5rem);
      top: 50%;
      transform: translateY(-50%);

      &::after {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-right-color: $grey-800;
      }
    }

    &.left {
      right: calc(100% + 0.5rem);
      top: 50%;
      transform: translateY(-50%);

      &::after {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-left-color: $grey-800;
      }
    }
  }
</style>

<div class="tooltip {position}" bind:this={tooltipEl}>
  {@render children()}
</div>
