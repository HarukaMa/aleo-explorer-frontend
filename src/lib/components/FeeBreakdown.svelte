<script lang="ts">
  import type { Snippet } from "svelte"
  import Decimal from "decimal.js"
  import AleoToken from "$lib/components/AleoToken.svelte"

  let { label, amount, children }: { label: string; amount?: string | Decimal; children?: Snippet } = $props()
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

  .group,
  .group-items {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .group {
    margin-bottom: 0.25rem;
  }

  .group-items {
    padding-left: 0.75rem;
  }

  .label {
    width: 5.5rem;
    color: $grey-600;
  }
</style>

{#if children}
  <div class="group">
    <div class="cell">
      <div class="label">{label}</div>
      <AleoToken number={amount ?? "0"} suffix />
    </div>
    <div class="group-items">
      {@render children()}
    </div>
  </div>
{:else}
  <div class="cell">
    <div class="label">{label}</div>
    <AleoToken number={amount ?? "0"} suffix />
  </div>
{/if}
