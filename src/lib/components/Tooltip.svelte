<script lang="ts">
  import type { Snippet } from "svelte"
  import { arrow, computePosition, flip, offset, shift } from "@floating-ui/dom"

  type Props = {
    children: Snippet
    tooltip_snippet: Snippet
    label: string
  }

  let { children, tooltip_snippet, label }: Props = $props()

  const tooltip_uid = $props.id()
  const tooltip_id = `${tooltip_uid}-tooltip`
  let root_element: HTMLButtonElement
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

  function handle_keydown(event: KeyboardEvent) {
    if (event.key === "Escape") hide_popup()
  }
</script>

<style lang="scss">
  .content {
    all: unset;
    display: flex;
    border-radius: 0.25rem;
    cursor: help;

    &:focus-visible {
      outline: 2px solid #1da1f2;
      outline-offset: 2px;
    }
  }

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
  }

  .arrow {
    position: absolute;
    background: black;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
  }
</style>

<button
  aria-describedby={tooltip_id}
  aria-label={label}
  bind:this={root_element}
  class="content"
  onblur={hide_popup}
  onfocus={show_popup}
  onkeydown={handle_keydown}
  onmouseenter={show_popup}
  onmouseleave={hide_popup}
  type="button"
>
  {@render children()}
</button>

<div bind:this={popup_element} class="tooltip" id={tooltip_id} role="tooltip">
  {@render tooltip_snippet()}
  <div bind:this={arrow_element} class="arrow"></div>
</div>
