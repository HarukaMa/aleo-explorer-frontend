<script lang="ts">

  import type { BeforeContainerState, BlockList } from "$lib/types"
  import { type ColumnDef, createTable, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import Link from "$lib/components/Link.svelte"
  import Time from "$lib/components/Time.svelte"
  import Number from "$lib/components/Number.svelte"
  import AleoCredit from "$lib/components/AleoCredit.svelte"
  import { getContext } from "svelte"

  let { data } = $props()

  console.log(data.blocks)

  let blocks = $state(data.blocks.blocks)
  let total_blocks = $state(data.blocks.total_blocks)
  let total_pages = $state(data.blocks.total_pages)

  let table_data: BlockList[] = $derived(blocks.map((block: any) => ({
    height: block.height,
    timestamp: block.timestamp,
    transactions: block.transaction_count,
    proof_target: block.proof_target,
    coinbase_target: block.coinbase_target,
    block_reward: block.block_reward,
    puzzle_reward: Math.floor(block.coinbase_reward * 2 / 3),
    puzzle_solutions: block.partial_solution_count,
  })))

  const columns: ColumnDef<BlockList>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: info => renderComponent(Link, {
        href: `/block/${info.getValue()}`,
        child_component: Number,
        number: info.getValue(),
      }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: info => renderComponent(Time, { timestamp: info.getValue() }),
    },
    {
      accessorKey: "transactions",
      header: "Transactions",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "proof_target",
      header: "Proof target",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "coinbase_target",
      header: "Coinbase target",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "block_reward",
      header: "Block reward",
      cell: info => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_reward",
      header: "Puzzle reward",
      cell: info => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_solutions",
      header: "Puzzle solutions",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
  ]

  const table = $derived(createTable<BlockList>({
    data: table_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  }))

  let header_data = $derived([
    { name: "Total blocks", value: { component: Number, props: { number: total_blocks } } },
    { name: "Total pages", value: { component: Number, props: { number: total_pages } } },
    { name: "placeholder 1", value: "placeholder 1" },
    { name: "placeholder 2", value: "placeholder 2" },
  ])

  let before_container_state: BeforeContainerState = getContext("before_container")
  before_container_state.snippet = before_container

  $effect(() => {
    return () => {
      before_container_state.snippet = undefined
    }
  })
</script>

<style lang="scss">

  @import 'static/styles/variables';

  div.header {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    background-color: $blue-50;
    padding: 1.5rem 0.5rem;
    border-radius: 1rem;
    box-sizing: border-box;
    gap: 2.5rem;
    align-items: center;
    justify-content: center;

    > * {
      max-width: 1620px;
      width: 100%;
    }

    .title {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .info {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 1rem;

      .info-data {
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        font-weight: 500;
        font-family: "Montserrat Variable", sans-serif;

        .info-data-title {
          font-family: "Open Sans Variable", system-ui;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .info-data-value {
          font-weight: 600;
          font-size: 1.125rem;
          line-height: 1.5rem;
        }
      }
    }

  }

</style>

{#snippet before_container()}
  <div class="header">
    <div class="title">Blocks</div>
    <div class="info">
      {#each header_data as data}
        <div class="info-data">
          <div class="info-data-title">{data.name}</div>
          <div class="info-data-value">
            {#if data.value instanceof Object}
              <svelte:component this={data.value.component} {...data.value.props} />
            {:else}
              {data.value}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}
