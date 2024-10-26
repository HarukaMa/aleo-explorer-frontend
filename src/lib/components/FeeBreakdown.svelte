<script lang="ts">
  import type { Snippet } from "svelte"
  import Decimal from "decimal.js"
  import AleoToken from "$lib/components/AleoToken.svelte"

  let { label, amount, children }: { label?: string; amount?: string | Decimal; children?: Snippet } = $props()
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .cell {
    display: flex;
    padding: 0.5rem 1rem;
    align-items: center;
    align-self: stretch;
    gap: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom: 1px solid $grey-200;
    border-left: 1px solid $grey-200;
  }

  .label {
    //width: 8.75rem;
    width: 5.5rem;
    color: $grey-600;
  }
</style>

<div class="cell" style:flex-direction={children ? "column" : "row"}>
  {#if children}
    {@render children()}
  {:else}
    <div class="label">{label}</div>
    <AleoToken number={amount ? amount : "0"} suffix />
  {/if}
</div>
