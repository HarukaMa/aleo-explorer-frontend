<script lang="ts">
  import Number from "$lib/components/Number.svelte"
  import Decimal from "decimal.js"

  interface AleoCredit {
    suffix?: boolean
    number: Decimal | string
  }

  let { suffix = false, number }: AleoCredit = $props()

  let credits = $derived(number instanceof Decimal ? number : new Decimal(number))
</script>

<Number
  number={credits.div(1000000)}
  precision={6}
  unit={suffix ? ` <span class="dim">Aleo Credits</span>` : undefined}
/>
