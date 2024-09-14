<script lang="ts">

  import type { Snippet } from "svelte"

  interface Link {
    href: string
    children?: Snippet
    content?: string
  }

  let { href, children, content }: Link = $props()

</script>

<style lang="scss">
  @import 'static/styles/variables';

  a {
    color: $blue-500;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

<a href={href}>
  {#if children}
    {@render children()}
  {:else}
    {content}
  {/if}
</a>