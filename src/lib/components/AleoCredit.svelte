<script lang="ts">
  import Number from "$lib/components/Number.svelte"

  interface AleoCredit {
    suffix?: boolean
    number: number
  }

  let { suffix = false, number }: AleoCredit = $props()

</script>

<Number number={number / 1000000} precision={6} unit={suffix ? "Aleo Credits" : undefined} />