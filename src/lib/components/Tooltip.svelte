<script lang="ts">
  import type { Snippet } from "svelte"
  import { arrow, computePosition, flip, offset, shift } from "@floating-ui/dom"

  type Props = {
    children: Snippet // original content
    tooltip_snippet: Snippet // tooltip content
  }

  let { children, tooltip_snippet }: Props = $props()

  let root_element: HTMLDivElement
  let popup_element: HTMLDivElement
  let arrow_element: HTMLDivElement
  let placement: "top" | "right" | "bottom" | "left" = $state("top")

  function show_popup() {
    popup_element.style.display = "flex"
    computePosition(root_element, popup_element, {
      placement: "top",
      middleware: [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrow_element })],
    }).then(({ x, y, placement: finalPlacement, middlewareData }) => {
      placement = finalPlacement.split("-")[0] as typeof placement

      Object.assign(popup_element.style, {
        left: `${x}px`,
        top: `${y}px`,
      })

      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {}
      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement]

      Object.assign(arrow_element.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        [staticSide]: "-4px",
      })
    })
  }

  function hide_popup() {
    popup_element.style.display = "none"
  }
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

<div bind:this={root_element} class="content" onmouseenter={show_popup} onmouseleave={hide_popup} role="tooltip">
  {@render children()}
</div>

<div bind:this={popup_element} class="tooltip">
  {@render tooltip_snippet()}
  <div bind:this={arrow_element} class="arrow"></div>
</div>
