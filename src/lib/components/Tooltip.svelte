<script lang="ts">
  import type { Snippet } from "svelte"
  // import { computePosition, flip, shift, offset, arrow, autoUpdate } from "@floating-ui/dom"

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()

  let tooltipEl: HTMLDivElement
  let arrowEl: HTMLDivElement
  let placement: "top" | "right" | "bottom" | "left" = $state("top")
  let isVisible = $state(false)
  let referenceEl: HTMLElement | null = null
  let cleanup: (() => void) | null = null

  function update() {
    if (!referenceEl || !tooltipEl) return

    // computePosition(referenceEl, tooltipEl, {
    //   placement: "top",
    //   middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowEl })],
    // }).then(({ x, y, placement: finalPlacement, middlewareData }) => {
    //   placement = finalPlacement.split("-")[0] as typeof placement

    //   Object.assign(tooltipEl.style, {
    //     left: `${x}px`,
    //     top: `${y}px`,
    //   })

    //   const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {}
    //   const staticSide = {
    //     top: "bottom",
    //     right: "left",
    //     bottom: "top",
    //     left: "right",
    //   }[placement]

    //   Object.assign(arrowEl.style, {
    //     left: arrowX != null ? `${arrowX}px` : "",
    //     top: arrowY != null ? `${arrowY}px` : "",
    //     right: "",
    //     bottom: "",
    //     [staticSide]: "-4px",
    //   })
    // })
  }

  export function show(reference: HTMLElement) {
    referenceEl = reference
    isVisible = true
    // cleanup = autoUpdate(referenceEl, tooltipEl, update)
  }

  export function hide() {
    isVisible = false
    cleanup?.()
    cleanup = null
  }

  $effect(() => {
    return () => {
      cleanup?.()
    }
  })
</script>

<style lang="scss">
  .tooltip {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem 0.75rem;
    background-color: black;
    color: white;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: normal;
    z-index: 100;
    width: max-content;
    max-width: 15rem;

    &.visible {
      display: block;
    }
  }

  .arrow {
    position: absolute;
    background: black;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
</style>

<div class="tooltip" class:visible={isVisible} bind:this={tooltipEl}>
  {@render children()}
  <div class="arrow" bind:this={arrowEl}></div>
</div>
