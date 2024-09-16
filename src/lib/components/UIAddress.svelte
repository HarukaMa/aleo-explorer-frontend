<script lang="ts">
  import type { UIAddressData, UIAddressDataItem } from "$lib/types"

  interface UIAddress {
    address: string
    name_data: UIAddressData
    short_address?: boolean
    with_logo?: boolean
    with_link?: boolean
    keep_font?: boolean
  }

  let {
    address,
    name_data,
    short_address = false,
    with_logo = false,
    with_link = false,
    keep_font = false,
  }: UIAddress = $props()

  let data: UIAddressDataItem | undefined = $derived(name_data[address])

  let truncated_address = $derived(address.slice(0, 13) + "..." + address.slice(-6))

  let cls = $derived(keep_font ? "" : "mono")

</script>

<style lang="scss">
  @import 'static/styles/variables';

</style>

{#if !data}
  {#if short_address}
    <span class={cls}>{truncated_address}</span>
  {:else}
    <span class={cls}>{address}</span>
  {/if}
{:else}
  {#if data.name}
    {data.name}
  {:else if data.tag}
    {data.tag}
  {:else}
    {#if short_address}
      <span class={cls}>{truncated_address}</span>
    {:else}
      <span class={cls}>{address}</span>
    {/if}
  {/if}
{/if}