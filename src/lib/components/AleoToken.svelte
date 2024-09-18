<script lang="ts">
  import Number from "$lib/components/Number.svelte"
  import Decimal from "decimal.js"

  interface AleoToken {
    suffix?: boolean
    number: Decimal | string
  }

  let { suffix = false, number }: AleoToken = $props()

  let credits = $derived(number instanceof Decimal ? number : new Decimal(number))
</script>

<Number number={credits.div(1000000)} precision={6} unit={suffix ? ` <span class="dim">ALEO</span>` : undefined} />
