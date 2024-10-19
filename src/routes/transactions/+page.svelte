<script lang="ts">
  import { type BeforeContainerState, type BlockList } from "$lib/types"
  import {
    type ColumnDef,
    createTable,
    FlexRender,
    getCoreRowModel,
    renderComponent,
    type Updater,
  } from "@tanstack/svelte-table"
  import Link from "$lib/components/Link.svelte"
  import Time from "$lib/components/Time.svelte"
  import Number from "$lib/components/Number.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import { getContext } from "svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import Decimal from "decimal.js"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"

  let { data } = $props()

  console.log(data.blocks)

  let blocks = $state(data.blocks.blocks)
  let total_blocks = $state(data.blocks.total_blocks)
  let total_pages = $state(data.blocks.total_pages)

  let table_data: BlockList[] = $derived(
    blocks.map((block: any) => ({
      height: block.height,
      timestamp: block.timestamp,
      transactions: block.transaction_count,
      proof_target: block.proof_target,
      coinbase_target: block.coinbase_target,
      block_reward: new Decimal(block.block_reward),
      puzzle_reward: new Decimal(Math.floor((block.coinbase_reward * 2) / 3)),
      puzzle_solutions: block.partial_solution_count,
    })),
  )

  const columns: ColumnDef<BlockList, any>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: (info) =>
        renderComponent(SnippetWrapper, {
          snippet: height_column,
          value: info.getValue(),
        }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    },
    {
      accessorKey: "transactions",
      header: "Transactions",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "proof_target",
      header: "Proof target",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "coinbase_target",
      header: "Coinbase target",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "block_reward",
      header: "Block reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_reward",
      header: "Puzzle reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_solutions",
      header: "Puzzle solutions",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
  ]

  type PaginationState = { pageIndex: number; pageSize: number }

  let pagination: PaginationState = $state({
    pageIndex: data.page - 1,
    pageSize: 20,
  })

  const table = createTable<BlockList>({
    get data() {
      return table_data
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    get rowCount() {
      return total_blocks
    },
    get pageCount() {
      return total_pages
    },
    get state() {
      return {
        pagination,
      }
    },
    onPaginationChange: onPaginationChange,
  })

  async function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    if (updaterOrValue instanceof Function) {
      updaterOrValue = updaterOrValue(pagination)
    }
    pagination = updaterOrValue
  }

  let header_data = $derived([
    { name: "Total blocks", value: { component: Number, props: { number: total_blocks } } },
    { name: "Total pages", value: { component: Number, props: { number: total_pages } } },
    { name: "placeholder 1", value: "placeholder 1" },
    { name: "placeholder 2", value: "placeholder 2" },
  ])

  let before_container_state: BeforeContainerState = getContext("before_container")
  before_container_state.snippet = before_container

  async function set_page(page: number) {
    table.setPageIndex(page - 1)
    const response = await fetch(`/api/blocks?p=${page}`)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    blocks = data.blocks
    total_blocks = data.total_blocks
    total_pages = data.total_pages

    const current_params = new URLSearchParams(location.search)
    current_params.set("page", page.toString())
    const new_url = `${location.pathname}?${current_params.toString()}`
    history.replaceState({}, "", new_url)
  }

  $effect(() => {
    return () => {
      before_container_state.snippet = undefined
    }
  })
</script>

<style lang="scss">
  @import "static/styles/variables";

  div.header {
    display: flex;
    flex-direction: column;
    margin: 0;
    background-color: $blue-50;
    padding: 1.5rem 1.5rem;
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
      padding-left: 1rem;
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

  table {
    width: 100%;
    margin-top: 2.5rem;
  }
</style>

{#snippet before_container()}
  <div class="header">
    <div class="title">Blocks</div>
    <!--    <div class="info">-->
    <!--      {#each header_data as data}-->
    <!--        <div class="info-data">-->
    <!--          <div class="info-data-title">{data.name}</div>-->
    <!--          <div class="info-data-value">-->
    <!--            {#if data.value instanceof Object}-->
    <!--              <data.value.component {...data.value.props} />-->
    <!--            {:else}-->
    <!--              {data.value}-->
    <!--            {/if}-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      {/each}-->
    <!--    </div>-->
  </div>
{/snippet}

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

<div class="table-container">
  <table>
    <thead>
      {#each table.getHeaderGroups() as header_group}
        <tr>
          {#each header_group.headers as header}
            <th>{header.column.columnDef.header}</th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each table.getRowModel().rows as row}
        <tr>
          {#each row.getVisibleCells() as cell}
            <td>
              <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#key pagination}
  <TableNav page={pagination.pageIndex + 1} {set_page} {total_pages} />
{/key}
