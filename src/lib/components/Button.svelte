<script lang="ts">
  import type { Component } from "svelte"
  import type { ButtonLinkClass } from "$lib/types"
  import type { MouseEventHandler } from "svelte/elements"

  interface Button {
    href?: string
    action?: MouseEventHandler<any>
    cls: ButtonLinkClass
    disabled?: boolean
    Content?: string | Component<any>
    icon?: string
    small?: boolean
  }

  let { href, action, cls, disabled = false, Content = "", icon, small = false, ...props }: Button = $props()

  let background_image: string | undefined = $state(undefined)
  let size: string | undefined = $state(undefined)
  let background_size: string | undefined = $state(undefined)
  if (icon) {
    background_image = `var(--${icon})`
    size = "32px"
    background_size = "20px"
  }

  let button_type: "submit" | "button" = href ? "submit" : "button"
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  button {
    all: unset;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    display: inline-flex;
    gap: 0.5rem;
    border-radius: 0.5rem;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;

    &.small {
      font-weight: normal;
      font-size: 0.875rem;
      line-height: 1rem;
      padding: 0.5rem 0.75rem;
    }

    &.primary {
      background-color: $blue-500;
      color: white;

      &:hover {
        background-color: $blue-600;
      }

      &:active {
        background-color: $blue-500;
      }
    }

    &.secondary {
      background-color: white;
      border: 1px solid $grey-200;
      color: black;

      &:hover {
        background-color: $grey-25;
      }
    }

    &.ghost {
      color: black;

      &:hover {
        background-color: $grey-50;
      }

      &:active {
        background-color: $grey-100;
      }
    }

    &[disabled] {
      background-color: $grey-100;
      color: $grey-300;
      cursor: not-allowed;

      &:hover {
        background: $grey-100;
      }
    }
  }
</style>

<form>
  <button
    class={cls}
    class:small
    {disabled}
    formaction={href}
    onclick={action}
    style:background-image={background_image}
    style:background-size={background_size}
    style:height={size}
    style:width={size}
    type={button_type}
  >
    {#if typeof Content === "string"}
      {Content}
    {:else}
      <Content {...props} />
    {/if}
  </button>
</form>
