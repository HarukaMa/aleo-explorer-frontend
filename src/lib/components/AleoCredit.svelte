<script lang="ts">
  import Number from "$lib/components/Number.svelte"
  import Decimal from "decimal.js"

  interface AleoCredit {
    suffix?: boolean
    number: Decimal
  }

  let { suffix = false, number }: AleoCredit = $props()

</script>

<Number number={number.div(1000000)} precision={6}
        unit={suffix ? ` <span class="dim">Aleo Credits</span>` : undefined} />