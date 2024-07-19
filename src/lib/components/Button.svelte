<script lang="ts">

  import type { Component } from "svelte"
  import type { ButtonLinkClass } from "$lib/types"
  import type { MouseEventHandler } from "svelte/elements"

  interface Button {
    href?: string
    action?: MouseEventHandler<any>
    cls: ButtonLinkClass
    disabled?: boolean
    content: string | Component<any>
  }

  let { href, action, cls, disabled = false, content, ...props }: Button = $props()

</script>

<style lang="scss">
  @import "/static/styles/variables";

  button {
    all: unset;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    height: 2.5rem;
    display: inline-flex;
    gap: 0.5rem;
    border-radius: 0.5rem;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;

    &.secondary {
      background: white;
      border: 1px solid $grey-200;
      color: black;

      &:hover {
        background: $grey-25;
      }
    }

    &[disabled] {
      background: $grey-100;
      color: $grey-300;
      cursor: not-allowed;

      &:hover {
        background: $grey-100;
      }
    }
  }

</style>

<form>
  <button class={cls} disabled={disabled} formaction={href} onclick={action}>
    {#if typeof content === "string"}
      {content}
    {:else}
      <svelte:component this={content} {...props} />
    {/if}
  </button>
</form>