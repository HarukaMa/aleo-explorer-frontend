<script lang="ts">
  import UIAddress from "$lib/components/UIAddress.svelte"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Number from "$lib/components/Number.svelte"
  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import Link from "$lib/components/Link.svelte"

  let { data } = $props()

  $inspect(data)

  let header_data = $derived([
    { name: "Known Nodes", value: data.validators + data.clients + data.provers + data.unknowns },
    { name: "Validators", value: data.validators },
    { name: "Clients", value: data.clients },
    { name: "Provers", value: data.provers },
    { name: "Unknown", value: data.unknowns },
  ])

  type Node = {
    ip: string
    type: string
    address: string
    height: number
    peers: number
    last_update: string
  }

  let table_data: Node[] = $derived(
    data.nodes.map((node: any) => ({
      ip: [node[0], node[1].direction],
      type: node[1].node_type,
      address: node[1].address,
      height: node[1].height,
      peers: node[1].peer_count,
      last_update: node[1].last_ping,
    })),
  )

  const columns: ColumnDef<Node, any>[] = [
    {
      accessorKey: "ip",
      header: "IP address",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: ip_column, value: info.getValue() }),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: type_column, value: info.getValue() }),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: address_column, value: info.getValue() }),
    },
    {
      accessorKey: "height",
      header: "Height",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: number_column, value: info.getValue() }),
    },
    {
      accessorKey: "peers",
      header: "Peers",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: number_column, value: info.getValue() }),
    },
    {
      accessorKey: "last_update",
      header: "Last update",
      cell: (info) => info.getValue(),
    },
  ]

  const table = createTable<Node>({
    get data() {
      return table_data
    },
    columns,
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
    display: flex;
    flex-direction: column;
    margin: 0;
    background-color: $blue-50;
    padding: 1.5rem 1.5rem;
    border-radius: 1rem;
    box-sizing: border-box;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;

    > * {
      max-width: 1620px;
      width: 100%;
    }

    .title {
      //padding-left: 1rem;
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: start;

      .info-data {
        flex: auto;
        min-width: 8rem;
        display: flex;
        flex-direction: column;
        @media (max-width: 768px) {
          flex: 1 1 calc(50% - 2rem);
        }

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

  .ip-cell {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .outgoing-icon {
    height: 20px;
    width: 20px;
    background-color: $green-500;
    mask-image: $outgoing-icon;
    -webkit-mask-image: $outgoing-icon;
    display: inline-block;
  }

  .incoming-icon {
    height: 20px;
    width: 20px;
    background-color: $red-500;
    mask-image: $outgoing-icon;
    -webkit-mask-image: $outgoing-icon;
    rotate: 180deg;
    display: inline-block;
  }

  .disconnected-icon {
    height: 20px;
    width: 20px;
    background-image: $disconnected-icon;
    display: inline-block;
  }
</style>

{#snippet before_container()}
  <div class="header">
    <div class="title">Nodes</div>
    <div class="info">
      {#each header_data as data}
        <div class="info-data">
          <div class="info-data-title">{data.name}</div>
          <div class="info-data-value">
            {#if data.value instanceof Object}
              <data.value.component {...data.value.props} />
            {:else}
              {data.value}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet ip_column(value)}
  <div class="ip-cell">
    {#if value[1] === "outgoing"}
      <div class="outgoing-icon"></div>
    {:else if value[1] === "incoming"}
      <div class="incoming-icon"></div>
    {:else if value[1] === "disconnected"}
      <div class="disconnected-icon"></div>
    {/if}
    {value[0]}
  </div>
{/snippet}

{#snippet type_column(value)}
  {#if value === 0}
    Client
  {:else if value === 1}
    Prover
  {:else if value === 2}
    Validator
  {:else}
    Unknown
  {/if}
{/snippet}

{#snippet address_column(value)}
  {#if !value}
    -
  {:else}
    <Link href="/address/{value}">
      <UIAddress address={value} name_data={data.resolved_addresses} />
    </Link>
  {/if}
{/snippet}

{#snippet number_column(value)}
  {#if !value}
    -
  {:else}
    <Number number={value} />
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
