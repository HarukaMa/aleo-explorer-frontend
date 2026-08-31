<script lang="ts">
  import Button from "$lib/components/Button.svelte"
  import { ButtonLinkClass } from "$lib/types"

  type TableNav = {
    page: number
    set_page: (page: number) => void
    total_pages: number
  }

  let { page, set_page, total_pages }: TableNav = $props()

  let page_options = $derived.by(() => {
    let options = []
    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 0 && i <= total_pages) {
        options.push(i)
      }
    }
    return options
  })
</script>

<style lang="scss">
  .table-nav {
    display: flex;
    gap: 0.25rem;
    margin: 1.5rem auto;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="table-nav">
  {#if page !== 1}
    <Button cls={ButtonLinkClass.Ghost} onclick={() => set_page(1)} icon="first-page-icon" label="First page" />
    <Button
      cls={ButtonLinkClass.Ghost}
      onclick={() => set_page(page - 1)}
      icon="prev-page-icon"
      label="Previous page"
    />
  {/if}
  {#each page_options as option}
    {#if option === page}
      <Button cls={ButtonLinkClass.Secondary} label={option.toString()} small />
    {:else}
      <Button cls={ButtonLinkClass.Ghost} onclick={() => set_page(option)} label={option.toString()} small />
    {/if}
  {/each}
  {#if page !== total_pages}
    <Button cls={ButtonLinkClass.Ghost} onclick={() => set_page(page + 1)} icon="next-page-icon" label="Next page" />
    <Button cls={ButtonLinkClass.Ghost} onclick={() => set_page(total_pages)} icon="last-page-icon" label="Last page" />
  {/if}
</div>
