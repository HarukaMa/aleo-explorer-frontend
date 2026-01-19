<script lang="ts">
  import {
    type ColumnDef,
    createTable,
    getCoreRowModel,
    type PaginationState,
    renderComponent,
    type Updater,
  } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Link from "$lib/components/Link.svelte"
  import Number from "$lib/components/Number.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"

  let { data } = $props()

  console.log(data.programs)

  let programs = $state(data.programs.programs)
  let total_programs = $state(data.programs.total_programs)
  let total_pages = $state(data.programs.total_pages)
  let id = $state(data.id)
  let edition = $state(data.edition)

  type ProgramList = {
    id: string
    height: number
    called: number
    transaction_id: string
  }

  let table_data: ProgramList[] = $derived(
    programs.map((program: any) => ({
      id: program.program_id,
      height: program.height,
      called: program.called,
      transaction_id: program.transaction_id,
    })),
  )

  const columns: ColumnDef<ProgramList, any>[] = [
    {
      accessorKey: "id",
      header: "Program ID",
      cell: (info) =>
        renderComponent(SnippetWrapper, {
          snippet: id_column,
          value: info.getValue(),
        }),
    },
    {
      accessorKey: "height",
      header: "Deploy height",
      cell: (info) =>
        renderComponent(SnippetWrapper, {
          snippet: height_column,
          value: info.getValue(),
        }),
    },
    {
      accessorKey: "transaction_id",
      header: "Deployment Transaction ID",
      cell: (info) =>
        renderComponent(SnippetWrapper, {
          snippet: txid_column,
          value: info.getValue(),
        }),
    },
    {
      accessorKey: "called",
      header: "Times called",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
  ]

  let pagination: PaginationState = $state({
    pageIndex: data.page - 1,
    pageSize: 20,
  })

  const table = createTable<ProgramList>({
    get data() {
      return table_data
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    get rowCount() {
      return total_programs
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

  async function set_page(page: number) {
    table.setPageIndex(page - 1)
    const response = await fetch(`/api/similar_programs/${id}/${edition || 0}?p=${page}`)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    programs = data.programs
    total_programs = data.total_programs
    total_pages = data.total_pages

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

{#snippet id_column(value)}
  <span class="mono ellipsis">
    <Link href="/program/{value}">{value}</Link>
  </span>
{/snippet}

{#snippet txid_column(value)}
  {#if value === null}
    -
  {:else}
    <span class="mono ellipsis">
      <Link href="/transaction/{value}">{value}</Link>
    </span>
  {/if}
{/snippet}

{#snippet height_column(value)}
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

{#key pagination}
  <TableNav page={pagination.pageIndex + 1} {set_page} {total_pages} />
{/key}
