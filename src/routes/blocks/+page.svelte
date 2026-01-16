<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { type BlockList } from "$lib/types"
  import {
    type ColumnDef,
    createTable,
    FlexRender,
    getCoreRowModel,
    type PaginationState,
    renderComponent,
    type Updater,
  } from "@tanstack/svelte-table"
  import Link from "$lib/components/Link.svelte"
  import Time from "$lib/components/Time.svelte"
  import Number from "$lib/components/Number.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import Decimal from "decimal.js"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"

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
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  table {
    width: 100%;
    margin-top: 2.5rem;
    white-space: nowrap;
  }
</style>

<Seo
  title="Aleo Blocks List | AleoScan - Aleo Blockchain Explorer"
  description="Explore recent Aleo blocks. View height, timestamp, transactions, block hash, and validators in real-time."
/>

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

<PageHeader content="Blocks" />

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

<PageInformation
  title="Block"
  description="A block in the Aleo blockchain is a fundamental unit that records transactions and state transitions. It is cryptographically secured and linked to the previous block, forming a chain. Each block contains data that is validated by the network’s consensus mechanism."
  icon="block-icon"
/>
