<script lang="ts">
  import type { ButtonLinkClass } from "$lib/types"
  import type { MouseEventHandler } from "svelte/elements"

  interface Button {
    href?: string
    onclick?: MouseEventHandler<HTMLButtonElement>
    cls: ButtonLinkClass
    disabled?: boolean
    label: string
    icon?: string
    small?: boolean
    type?: "button" | "submit"
  }

  let { href, onclick, cls, disabled = false, label, icon, small = false, type = "button" }: Button = $props()
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .button {
    all: unset;
    box-sizing: border-box;
    padding: 0.5rem 1rem;
    display: inline-flex;
    gap: 0.5rem;
    border-radius: 0.5rem;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;

    &:focus-visible {
      outline: 2px solid $blue-500;
      outline-offset: 2px;
    }

    &.icon {
      width: 32px;
      height: 32px;
      background-size: 20px;
    }

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

{#if href}
  <a class="button {cls}" class:small {href}>{label}</a>
{:else}
  <button
    class="button {cls}"
    class:icon={icon !== undefined}
    class:small
    {disabled}
    {onclick}
    style:background-image={icon ? `var(--${icon})` : undefined}
    {type}
    aria-label={icon ? label : undefined}
  >
    {#if !icon}{label}{/if}
  </button>
{/if}
