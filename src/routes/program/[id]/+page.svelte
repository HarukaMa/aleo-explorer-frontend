<script lang="ts">
  import { type BeforeContainerState, StatusClass } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  $inspect(data)

  const tab_data = [
    { title: "Program structure", id: "structure" },
    { title: "Recent transitions", id: "recent_calls" },
    { title: "Source code", id: "source_code" },
    { title: "Read mappings", id: "read_mappings" },
  ]

  type TransitionList = {
    height: number
    timestamp: number
    transaction_id: string
    function_name: string
    type: string
  }

  let transition_table_data: TransitionList[] = $derived(data.recent_calls)

  const transition_table_columns: ColumnDef<TransitionList, any>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: height_column, value: info.getValue() }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    },
    {
      accessorKey: "transition_id",
      header: "Transition ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: transition_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "function_name",
      header: "Function called",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: function_column, value: info.getValue() }),
    },
    {
      accessorKey: "type",
      header: "Status",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: status_column, value: info.getValue() }),
    },
  ]

  const transition_table = createTable<TransitionList>({
    get data() {
      return transition_table_data
    },
    columns: transition_table_columns,
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
    .program-icon {
      height: 32px;
      width: 32px;
      background-image: $program-icon;
    }

    .program-id {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .program-title {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  .details {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    align-self: stretch;

    .group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
      width: 100%;
    }

    .details-line {
      width: 100%;
      height: 1px;
      background-color: $grey-100;
    }
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .secondary {
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: $grey-600;
  }

  #validator-toggle {
    color: $blue-600;
    cursor: pointer;
  }

  #validator-list {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  table {
    width: 100%;
  }

  .tab {
    margin-top: 2rem;
  }

  .ellipsis {
    max-width: 30vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .aborted-header {
    font-size: 1rem;
    font-family: "Montserrat Variable", sans-serif;
    font-weight: 600;
    line-height: 1.25rem;
    margin-top: 1rem;
  }

  .fee-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .mapping-operations {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .operation {
    display: grid;
    padding: 1.5rem;
    grid-row-gap: 1rem;
    grid-column-gap: 0.5rem;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    border-radius: 1rem;
    border: 1px solid $grey-100;
    word-break: break-all;

    .column :nth-child(2) {
      line-height: 1.25rem;
    }
  }
</style>

{#snippet transition_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

{#snippet function_column(value)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet status_column(value)}
  {#if value.startsWith("Accepted")}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else if value.startsWith("Rejected")}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {:else}
    <Status cls={StatusClass.Warning}>Unknown</Status>
  {/if}
{/snippet}

{#snippet before_container()}
  <div class="header">
    <div class="flex">
      <div class="program-icon"></div>
      <div class="vert">
        <div class="program-title">Program</div>
        <div class="program-id">
          {data.program_id}
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="details">
  <div class="group">
    <DetailLine label="Program ID">
      <span class="mono">{data.program_id}</span>
    </DetailLine>
    <DetailLine label="Program address">
      <Link href="/address/{data.address}">
        <UIAddress address={data.address} name_data={{}} />
      </Link>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  {#if data.transaction_id !== null}
    <div class="group">
      <DetailLine label="Deployment transaction">
        <Link href="/transaction/{data.transaction_id}">
          <span class="mono">{data.transaction_id}</span>
        </Link>
      </DetailLine>
      <DetailLine label="Program owner">
        <Link href="/address/{data.owner}">
          <UIAddress address={data.owner} name_data={data.resolved_addresses} />
        </Link>
      </DetailLine>
    </div>
    <div class="group">
      <div class="details-line"></div>
    </div>
  {/if}
  <div class="group">
    <DetailLine label="Times called">
      <Number number={data.times_called} />
    </DetailLine>
    <DetailLine label="Similar programs">
      {#if data.similar_count === 0}
        0
      {:else}
        <Link href="/similar_programs/{data.program_id}">
          <Number number={data.similar_count} />
        </Link>
      {/if}
    </DetailLine>
  </div>
</div>

<Tabs {tab_data}>
  {#snippet structure(binds)}
    <div class="tab" bind:this={binds.structure}>111111111111</div>
  {/snippet}
  {#snippet recent_calls(binds)}
    <div class="tab" bind:this={binds.recent_calls}>
      <div class="table-container">
        <table>
          <thead>
            {#each transition_table.getHeaderGroups() as header_group}
              <tr>
                {#each header_group.headers as header}
                  <th>{header.column.columnDef.header}</th>
                {/each}
              </tr>
            {/each}
          </thead>
          <tbody>
            {#each transition_table.getRowModel().rows as row}
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
    </div>
  {/snippet}
  {#snippet source_code(binds)}
    <div class="tab" bind:this={binds.source_code}>22222222222</div>
  {/snippet}
  {#snippet read_mappings(binds)}
    <div class="tab" bind:this={binds.read_mappings}>32333333333</div>
  {/snippet}
</Tabs>
