<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { type BeforeContainerState } from "$lib/types"
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
  import Number from "$lib/components/Number.svelte"
  import { getContext } from "svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"

  let { data } = $props()

  console.log(data.programs)

  let programs = $state(data.programs.programs)
  let total_programs = $state(data.programs.total_programs)
  let total_pages = $state(data.programs.total_pages)

  type ProgramList = {
    id: string
    height: number
    called: number
    edition: number
    transaction_id: string
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

  const columns: ColumnDef<ProgramList, any>[] = [
    {
      accessorFn: (row) => {
        return { id: row.id, edition: row.edition }
      },
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
      accessorKey: "edition",
      header: "Edition",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
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

  let before_container_state: BeforeContainerState = getContext("before_container")
  before_container_state.snippet = before_container

  async function set_page(page: number) {
    table.setPageIndex(page - 1)
    const response = await fetch(`/api/programs?p=${page}`)
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

  $effect(() => {
    return () => {
      before_container_state.snippet = undefined
    }
  })
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

  table {
    width: 100%;
    margin-top: 2.5rem;
    white-space: nowrap;
  }
</style>

<Seo
  title="Aleo Programs List | AleoScan - Aleo Blockchain Explorer"
  description="Discover Aleo smart programs. View deployed contracts, execution data, and transaction logs."
  keywords="Aleo programs, smart contracts, blockchain contracts, zero-knowledge applications"
/>

{#snippet before_container()}
  <div class="header">
    <div class="title">Program Registry</div>
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

{#snippet id_column(value)}
  <span class="mono ellipsis">
    <Link href="/program/{value.id}/{value.edition}">{value.id}</Link>
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
  title="Program"
  description="A program on the Aleo blockchain is a smart contract that allows users to interact with private computations. These programs leverage zero-knowledge cryptography to ensure that the details of transactions and operations remain private. Programs can be deployed and called by any participant on the network."
  icon="program-icon"
/>