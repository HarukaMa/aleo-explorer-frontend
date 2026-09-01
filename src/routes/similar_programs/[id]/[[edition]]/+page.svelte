<script lang="ts">
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Link from "$lib/components/Link.svelte"
  import Number from "$lib/components/Number.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import { createAppColumnHelper } from "$lib/table"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"

  let { data } = $props()

  let programs = $derived(data.programs.programs)
  let total_pages = $derived(data.programs.total_pages)
  let id = $derived(data.id)
  let edition = $derived(data.edition)

  type ProgramList = {
    id: string
    height: number | null
    called: number
    transaction_id: string | null
  }

  let table_data: ProgramList[] = $derived(
    programs.map((program: any) => ({
      id: program.program_id,
      height: program.height,
      called: program.called,
      transaction_id: program.transaction_id,
    })),
  )

  const column = createAppColumnHelper<ProgramList>()
  const columns = column.columns([
    column.accessor("id", {
      header: "Program ID",
      cell: (info) => renderSnippet(id_column, info.getValue()),
    }),
    column.accessor("height", {
      header: "Deploy height",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    column.accessor("transaction_id", {
      header: "Deployment Transaction ID",
      cell: (info) => renderSnippet(txid_column, info.getValue()),
    }),
    column.accessor("called", {
      header: "Times called",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
  ])

  let current_page = $derived(+data.page)

  async function set_page(page: number) {
    const response = await fetch(`/api/similar_programs/${id}/${edition || 0}?p=${page}`)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    programs = data.programs
    total_pages = data.total_pages
    current_page = page

    const current_params = new URLSearchParams(location.search)
    current_params.set("page", page.toString())
    const new_url = `${location.pathname}?${current_params.toString()}`
    history.replaceState({}, "", new_url)
  }
</script>

{#snippet id_column(value: string)}
  <span class="mono ellipsis">
    <Link href="/program/{value}">{value}</Link>
  </span>
{/snippet}

{#snippet txid_column(value: string | null)}
  {#if value === null}
    -
  {:else}
    <span class="mono ellipsis">
      <Link href="/transaction/{value}">{value}</Link>
    </span>
  {/if}
{/snippet}

{#snippet height_column(value: number | null)}
  {#if value === null}
    -
  {:else}
    <Link href="/block/{value}">
      <Number number={value} />
    </Link>
  {/if}
{/snippet}

<PageHeader content="Similar Programs" />

<TableContainer>
  <DataTable {columns} data={table_data}>
    {#snippet emptyState()}
      <Callout title="No similar programs" description="There are no similar programs found." icon="list-icon" />
    {/snippet}
  </DataTable>
</TableContainer>

{#key current_page}
  <TableNav page={current_page} {set_page} {total_pages} />
{/key}
