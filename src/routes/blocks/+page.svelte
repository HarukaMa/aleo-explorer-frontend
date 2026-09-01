<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { type BlockList } from "$lib/types"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Link from "$lib/components/Link.svelte"
  import Time from "$lib/components/Time.svelte"
  import Number from "$lib/components/Number.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import Decimal from "decimal.js"
  import { createAppColumnHelper } from "$lib/table"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import type { Blocks } from "$lib/server/api/chain"
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()

  let blocks = $state(data.blocks.blocks)
  let total_blocks = $state(data.blocks.total_blocks)
  let total_pages = $state(data.blocks.total_pages)
  let current_page = $state(+data.page)

  let table_data: BlockList[] = $derived(
    blocks.map((block) => ({
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

  const column = createAppColumnHelper<BlockList>()
  const columns = column.columns([
    column.accessor("height", {
      header: "Height",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    }),
    column.accessor("transactions", {
      header: "Transactions",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    column.accessor("proof_target", {
      header: "Proof target",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    column.accessor("coinbase_target", {
      header: "Coinbase target",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    column.accessor("block_reward", {
      header: "Block reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
    column.accessor("puzzle_reward", {
      header: "Puzzle reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
    column.accessor("puzzle_solutions", {
      header: "Puzzle solutions",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
  ])

  async function set_page(page: number) {
    const response = await fetch(`/api/blocks?p=${page}`)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const response_data: Blocks = await response.json()
    blocks = response_data.blocks
    total_blocks = response_data.total_blocks
    total_pages = response_data.total_pages
    current_page = page

    const current_params = new URLSearchParams(location.search)
    current_params.set("page", page.toString())
    const new_url = `${location.pathname}?${current_params.toString()}`
    history.replaceState({}, "", new_url)
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;
</style>

<Seo
  title="Aleo Blocks List | AleoScan - Aleo Blockchain Explorer"
  description="Explore recent Aleo blocks. View height, timestamp, transactions, block hash, and validators in real-time."
/>

{#snippet height_column(value: number)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

<PageHeader content="Blocks" />

<TableContainer>
  <DataTable {columns} data={table_data}>
    {#snippet emptyState()}
      <Callout title="No blocks" description="There are no blocks available." icon="list-icon" />
    {/snippet}
  </DataTable>
</TableContainer>

{#key current_page}
  <TableNav page={current_page} {set_page} {total_pages} />
{/key}

<PageInformation
  title="Block"
  description="A block in the Aleo blockchain is a fundamental unit that records transactions and state transitions. It is cryptographically secured and linked to the previous block, forming a chain. Each block contains data that is validated by the network’s consensus mechanism."
  icon="block-icon"
/>
