<script lang="ts">
  import { type BeforeContainerState, ButtonLinkClass, SearchError } from "$lib/types"
  import { getContext } from "svelte"
  import Button from "$lib/components/Button.svelte"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"

  let { data: server_data } = $props()
  let { query, result, error } = $derived(server_data)

  $inspect({ query, result, error })

  let search_type = $derived.by(() => {
    if (result.type === "blocks") {
      return "Block"
    } else if (result.type === "transactions") {
      return "Transaction"
    } else if (result.type === "transitions") {
      return "Transition"
    } else if (result.type === "addresses") {
      return "Address"
    } else if (result.type === "solutions") {
      return "Solution"
    } else if (result.type === "ans_program") {
      return "ANS / Program"
    } else {
      return "Unknown"
    }
  })

  let result_link_part = $derived.by(() => {
    if (result.type === "blocks") {
      return "/block/"
    } else if (result.type === "transactions") {
      return "/transaction/"
    } else if (result.type === "transitions") {
      return "/transition/"
    } else if (result.type === "addresses") {
      return "/address/"
    } else if (result.type === "solutions") {
      return "/solution/"
    } else if (result.type === "ans_program") {
      return "/ans/"
    } else {
      return ""
    }
  })

  let error_title = $derived.by(() => {
    if (error === SearchError.QueryTooShort) {
      return "Query too short"
    } else if (error === SearchError.NotFound) {
      return `${search_type} not found`
    }
    return "An error occurred"
  })

  let error_message = $derived.by(() => {
    if (error === SearchError.QueryTooShort) {
      return "Your search query is too short. Please enter a longer query."
    }
    return "Your search returned no results. Please check your query and try again."
  })

  type TableItem = {
    value: string
  }

  let table_data: TableItem[] = $derived.by(() => {
    const data = () => {
      if (result.type === "blocks") {
        return result.blocks
      } else if (result.type === "transactions") {
        return result.transactions
      } else if (result.type === "transitions") {
        return result.transitions
      } else if (result.type === "addresses") {
        return result.addresses
      } else if (result.type === "solutions") {
        return result.solutions
      } else if (result.type === "ans_program") {
        return result.names
      } else {
        return []
      }
    }
    return data().map((value: string) => ({ value }))
  })

  let columns: ColumnDef<TableItem, any>[] = $derived.by(() => {
    let header = ""

    if (result.type === "blocks") {
      header = "Block"
    } else if (result.type === "transactions") {
      header = "Transaction"
    } else if (result.type === "transitions") {
      header = "Transition"
    } else if (result.type === "addresses") {
      header = "Address"
    } else if (result.type === "solutions") {
      header = "Solution"
    } else if (result.type === "ans_program") {
      header = "ANS"
    }
    return [
      {
        accessorKey: "value",
        header: header,
        cell: (info) =>
          renderComponent(SnippetWrapper, {
            snippet: data_column,
            value: info.getValue(),
          }),
      },
    ]
  })

  const table = createTable<TableItem>({
    get data() {
      return table_data
    },
    get columns() {
      return columns
    },
    getCoreRowModel: getCoreRowModel(),
  })

  let before_container_state: BeforeContainerState = getContext("before_container")
  before_container_state.snippet = before_container

  $effect(() => {
    return () => {
      before_container_state.snippet = undefined
    }
  })
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  div.header {
    .search-title {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }
  }

  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 7.5rem 0;
  }

  .error-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error-icon-container {
    display: flex;
    padding: 2rem;
    border-radius: 6.25rem;
    background: $grey-25;
  }

  .error-icon {
    width: 3rem;
    height: 3rem;
    background: $search-error-icon;
  }

  .spacer {
    padding-top: 1.25rem;
  }

  .table-container {
    margin-top: 2.5rem;

    table {
      width: 100%;
    }
  }
</style>

{#snippet before_container()}
  {#if error === undefined}
    <div class="header">
      <div class="flex">
        <div class="vert">
          <div class="search-title">Search results ({search_type}) - {query}</div>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

{#snippet data_column(value)}
  <span class="mono"><Link href="{result_link_part}{value}">{value}</Link></span>
{/snippet}

{#if error !== undefined}
  <div class="error-container">
    <div class="error-column">
      <div class="error-icon-container">
        <div class="error-icon"></div>
      </div>
      <div class="spacer headers-small">{error_title}</div>
      <div class="error-message">{error_message}</div>
      <div class="spacer"></div>
      <Button cls={ButtonLinkClass.Primary} href="/" Content="Go to homepage"></Button>
    </div>
  </div>
{:else}
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
{/if}
