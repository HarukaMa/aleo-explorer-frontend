<style lang="scss">


  .thousands-separator {
    user-select: none;
    -webkit-user-select: none;
  }
</style>

<script lang="ts">
  import Decimal from "decimal.js"

  interface Number {
    number: number | Decimal | bigint | string
    precision?: number
    unit?: string
    flash?: boolean
  }

  let { number, precision = 0, unit, flash = false }: Number = $props()

  let prev_number = $state<number | Decimal | bigint | string>(number)

  let integer_part = $derived.by(() => {
    if (typeof number === "bigint") {
      return number.toString()
    } else if (typeof number === "string") {
      return new Decimal(number).floor().toString()
    } else if (number instanceof Decimal) {
      return number.floor().toString()
    } else {
      return number.toFixed(precision).split(".")[0]
    }
  })

  function trim_zero_decimal(decimal: string | undefined) {
    if (decimal === undefined) {
      return ""
    }
    const groups = decimal.match(/.{1,3}/g)
    if (groups === null) {
      return ""
    }
    while (groups.length > 0 && groups[groups.length - 1] === "000") {
      groups.pop()
    }
    return groups.join("")
  }

  let decimal_part = $derived.by(() => {
    if (typeof number === "bigint") {
      return ""
    } else if (typeof number === "string") {
      const n = new Decimal(number)
      if (n.isInteger()) {
        return ""
      }
      return trim_zero_decimal(new Decimal(number).mod(1).toString().slice(2, precision + 2))
    } else if (number instanceof Decimal) {
      if (number.isInteger()) {
        return ""
      }
      return trim_zero_decimal(number.mod(1).toFixed(precision).slice(2, precision + 2))
    } else {
      return trim_zero_decimal(number.toFixed(precision).split(".")[1])
    }
  })

  let span: HTMLSpanElement
  $effect(() => {
    if (flash && prev_number !== number) {
      prev_number = number
      span.classList.add("flash")
      setTimeout(() => {
        span.classList.remove("flash")
      }, 600)
    }
  })
  const integer_parts = $derived(integer_part.split("").reverse().join("").match(/.{1,3}/g)?.map((x) => x.split("").reverse().join("")).reverse() || [])
</script>

<!-- Prevents formatting as we don't want any extra whitespaces in html -->
<!-- @formatter:off -->
<span class="formatted-number" bind:this={span}>{#each integer_parts as part, i}{#if i > 0}<span class="thousands-separator">,</span>{/if}{part}{/each}{#if decimal_part}<span class="decimal-separator">.</span>{decimal_part}{/if}{#if unit}<span class="unit">{@html unit}</span>{/if}</span>
<!-- @formatter:on -->