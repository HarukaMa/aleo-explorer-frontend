<script lang="ts">
  import type { Snippet } from "svelte"

  interface Link {
    href: string
    children?: Snippet
    content?: string
    external?: boolean
  }

  let { href, children, content, external = false }: Link = $props()

  let target = external ? "_blank" : undefined
  let rel = external ? "nofollow" : undefined
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  a {
    color: $grey-600;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

<a {href} {rel} {target}>
  {#if children}
    {@render children()}
  {:else}
    {content}
  {/if}
</a>
