<style lang="scss">

  .formatted-number {
    font-weight: 700;
  }

  .thousands-separator {
    user-select: none;
    -webkit-user-select: none;
  }
</style>

<script lang="ts">
  interface Number {
    number: number | bigint
    precision?: number
    unit?: string
  }

  let { number, precision = 0, unit }: Number = $props()

  let integer_part: string = $state("")
  let decimal_part: string = $state("")
  if (typeof number === "bigint") {
    integer_part = number.toString()
    decimal_part = ""
  } else {
    const [int, dec] = number.toFixed(precision).split(".")
    integer_part = int
    decimal_part = dec
  }
  const integer_parts = $derived(integer_part.split("").reverse().join("").match(/.{1,3}/g)?.map((x) => x.split("").reverse().join("")).reverse() || [])
</script>

<!-- Prevents formatting as we don't want any extra whitespaces in html -->
<!-- @formatter:off -->
<span class="formatted-number tnum">{#each integer_parts as part, i}{#if i > 0}<span class="thousands-separator">,</span>{/if}{part}{/each}{#if decimal_part}<span class="decimal-separator">.</span>{decimal_part}{/if}{#if unit}<span class="unit">&nbsp;{unit}</span>{/if}</span>
<!-- @formatter:on -->