<script lang="ts">
  import Decimal from "decimal.js"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"
  import AleoCredit from "$lib/components/AleoCredit.svelte"
  import Number from "$lib/components/Number.svelte"

  let { data: load_data } = $props()

  let data = $state(load_data.validators)

  let total_stake = $derived(data.total_stake)

  $inspect(data)

  type ValidatorList = {
    rank: number
    address: string
    website: string | undefined
    total_staked: Decimal
    voting_power: Decimal
    commission: number
    uptime: number
  }

  let table_data: ValidatorList[] = $derived(
    data.validators.map((validator: any, index: number) => ({
      rank: index + 1,
      address: validator.address,
      website: data.resolved_addresses[validator.address]?.link,
      total_staked: new Decimal(validator.stake),
      voting_power: new Decimal(validator.stake).div(total_stake),
      commission: validator.commission,
      uptime: validator.uptime,
    })),
  )

  const columns: ColumnDef<ValidatorList, any>[] = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: address_column, value: info.getValue() }),
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: website_column, value: info.getValue() }),
    },
    {
      accessorKey: "total_staked",
      header: "Total Staked",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue(), suffix: true }),
    },
    {
      accessorKey: "voting_power",
      header: "Voting Power",
      cell: (info) => renderComponent(Number, { number: info.getValue().times(100), precision: 2, unit: "%" }),
    },
    {
      accessorKey: "commission",
      header: "Commission",
      cell: (info) => renderComponent(Number, { number: info.getValue(), unit: "%" }),
    },
    {
      accessorKey: "uptime",
      header: "Uptime",
      cell: (info) => renderComponent(Number, { number: info.getValue() * 100, precision: 2, unit: "%" }),
    },
  ]

  const table = createTable<ValidatorList>({
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
  @import "static/styles/variables";

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
  }

  table {
    width: 100%;
    margin-top: 2.5rem;
  }

  .address-cell {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-placeholder {
    width: 32px;
    height: 32px;
    background-color: $blue-50;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-placeholder-icon {
    width: 20px;
    height: 20px;
    background-color: $blue-500;
    mask-image: $validator-icon;
  }

  .secondary {
    font-size: 0.75rem;
    line-height: 0.875rem;
    color: $grey-600;

    &.mono {
      font-family: "Inconsolata Variable", monospace;
      font-size: 0.8rem;
    }
  }

  .no-website {
    color: $grey-400;
  }
</style>

{#snippet before_container()}
  <div class="header">
    <div class="title">Validators</div>
  </div>
{/snippet}

{#snippet address_column(value)}
  <div class="address-cell">
    {#if data.resolved_addresses[value]?.logo}
      <img
        alt={data.resolved_addresses[value].tag}
        src="https://r2.aleoscan.io/{data.resolved_addresses[value].logo}"
      />
    {:else}
      <div class="logo-placeholder">
        <div class="logo-placeholder-icon"></div>
      </div>
    {/if}
    <div class="column">
      <Link href="/address/{value}">
        {#if data.resolved_addresses[value]?.tag}
          {data.resolved_addresses[value].tag}
        {:else}
          Anonymous
        {/if}
      </Link>
      <span class="secondary mono">{value.slice(0, 13) + "..." + value.slice(-6)}</span>
    </div>
  </div>
{/snippet}

{#snippet website_column(value)}
  {#if value}
    <Link href={value}>
      {URL.parse(value).hostname.split(".").splice(-2).join(".")}
    </Link>
  {:else}
    <span class="no-website">None</span>
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
