<script lang="ts">
  import type { Snippet } from "svelte"

  interface Link {
    href: string
    children?: Snippet
    content?: string
    external?: boolean
    secondary?: boolean
  }

  let { href, children, content, external = false, secondary = false }: Link = $props()

  let target = external ? "_blank" : undefined
  let rel = external ? "nofollow" : undefined
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  a {
    color: $blue-600;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      text-decoration: underline;

      &.secondary {
        text-decoration-color: $grey-600;
      }
    }
  }
</style>

<a class={[{secondary}]} {href} {rel} {target}>
  {#if children}
    {@render children()}
  {:else}
    {content}
  {/if}
</a>
