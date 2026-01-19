<script lang="ts" generics="TData">
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel } from "@tanstack/svelte-table"
  import type { Snippet } from "svelte"

  interface Props {
    columns: ColumnDef<TData, any>[]
    data: TData[]
    isLoading?: boolean
    isError?: boolean
    emptyState?: Snippet
    loadingState?: Snippet
    errorState?: Snippet
    class?: string
  }

  let {
    columns,
    data,
    isLoading = false,
    isError = false,
    emptyState,
    loadingState,
    errorState,
    class: className,
  }: Props = $props()

  const table = createTable<TData>({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
    getCoreRowModel: getCoreRowModel(),
  })

  let rows = $derived(table.getRowModel().rows)
</script>

<style>
  .table-container {
    max-width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    white-space: nowrap;
  }
</style>

{#if isLoading && loadingState}
  {@render loadingState()}
{:else if isError && errorState}
  {@render errorState()}
{:else if rows.length === 0 && emptyState}
  {@render emptyState()}
{:else}
  <div class="table-container">
    <table class={className}>
    <thead>
      {#each table.getHeaderGroups() as header_group}
        <tr>
          {#each header_group.headers as header}
            <th>
              {#if !header.isPlaceholder}
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody>
      {#each rows as row}
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
