<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Link from "$lib/components/Link.svelte"
  import Number from "$lib/components/Number.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import { createAppColumnHelper } from "$lib/table"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"

  let { data } = $props()

  let programs = $state(data.programs.programs)
  let total_programs = $state(data.programs.total_programs)
  let total_pages = $state(data.programs.total_pages)

  type ProgramList = {
    id: string
    height: number | null
    called: number
    edition: number
    transaction_id: string | null
  }

  let table_data: ProgramList[] = $derived(
    programs.map((program: any) => ({
      id: program.id,
      height: program.height,
      called: program.called,
      edition: program.edition,
      transaction_id: program.transaction_id,
    })),
  )

  const column = createAppColumnHelper<ProgramList>()
  const columns = column.columns([
    column.accessor((row) => ({ id: row.id, edition: row.edition }), {
      id: "program",
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
    column.accessor("edition", {
      header: "Edition",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    column.accessor("called", {
      header: "Times called",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
  ])

  let current_page = $state(+data.page)

  async function set_page(page: number) {
    const response = await fetch(`/api/programs?p=${page}`)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    programs = data.programs
    total_programs = data.total_programs
    total_pages = data.total_pages
    current_page = page

    const current_params = new URLSearchParams(location.search)
    current_params.set("page", page.toString())
    const new_url = `${location.pathname}?${current_params.toString()}`
    history.replaceState({}, "", new_url)
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

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
</style>

<Seo
  title="Aleo Programs List | AleoScan - Aleo Blockchain Explorer"
  description="Discover Aleo smart programs. View deployed contracts, execution data, and transaction logs."
/>

{#snippet id_column(value: { id: string; edition: number })}
  <span class="mono ellipsis">
    <Link href="/program/{value.id}/{value.edition}">{value.id}</Link>
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

<PageHeader content="Program Registry" />

<TableContainer>
  <DataTable {columns} data={table_data}>
    {#snippet emptyState()}
      <Callout title="No programs" description="There are no programs available." icon="list-icon" />
    {/snippet}
  </DataTable>
</TableContainer>

{#key current_page}
  <TableNav page={current_page} {set_page} {total_pages} />
{/key}

<PageInformation
  title="Program"
  description="A program on the Aleo blockchain is a smart contract that allows users to interact with private computations. These programs leverage zero-knowledge cryptography to ensure that the details of transactions and operations remain private. Programs can be deployed and called by any participant on the network."
  icon="program-icon"
/>
