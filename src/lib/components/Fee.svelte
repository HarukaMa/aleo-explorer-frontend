<script lang="ts">
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import Decimal from "decimal.js"

  type Fee = {
    total_base_fee: Decimal
    total_priority_fee: Decimal
    total_burnt_fee: Decimal
  }

  let { total_base_fee, total_priority_fee, total_burnt_fee }: Fee = $props()
</script>

<AleoCredit number={total_base_fee}></AleoCredit> base
{#if total_priority_fee.gt(0)}
  +
  <AleoCredit number={total_priority_fee}></AleoCredit>
  priority
{/if}
{#if total_burnt_fee.gt(0)}
  +
  <AleoCredit number={total_burnt_fee}></AleoCredit>
  burnt
{/if}
