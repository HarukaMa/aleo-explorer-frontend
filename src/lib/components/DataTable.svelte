<script generics="TData extends RowData" lang="ts">
  import { FlexRender } from "@tanstack/svelte-table"
  import { createAppTable, type DataTableColumns } from "$lib/table"
  import type { Snippet } from "svelte"

  interface Props {
    columns: DataTableColumns<TData>
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

  const table = createAppTable<TData>({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
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
                <FlexRender {header} />
              {/if}
            </th>
          {/each}
        </tr>
      {/each}
      </thead>
      <tbody>
      {#each rows as row}
        <tr>
          {#each row.getAllCells() as cell}
            <td>
              <FlexRender {cell} />
            </td>
          {/each}
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
{/if}
