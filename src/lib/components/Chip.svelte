<script lang="ts">
  import type { Snippet } from "svelte"

  interface Chip {
    color?: string
    children: Snippet
    link?: string
  }

  let { color, children, link }: Chip = $props()

  console.log(color)

</script>

<style lang="scss">

  @import 'static/styles/variables';

  .chip {
    display: inline-flex;
    padding: 0.125rem 0.75rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-radius: 1rem;
    border: 1px solid $grey-100;

    &:hover {
      background-color: $grey-25;
    }
  }

  a.chip {
    text-decoration: none;
    color: inherit;
  }
</style>

{#if link}
  <a href={link} class="chip" style:color={color}>
    {@render children()}
  </a>
{:else}
  <div class="chip" style:color={color}>
    {@render children()}
  </div>
{/if}

