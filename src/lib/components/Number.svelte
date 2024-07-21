<style lang="scss">


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

  let prev_number = $state<number | bigint>(number)

  let integer_part = $derived.by(() => {
    if (typeof number === "bigint") {
      return number.toString()
    } else {
      return number.toFixed(precision).split(".")[0]
    }
  })

  let decimal_part = $derived.by(() => {
    if (typeof number === "bigint") {
      return ""
    } else {
      return number.toFixed(precision).split(".")[1]
    }
  })
  let span: HTMLSpanElement
  $effect(() => {
    if (prev_number !== number) {
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