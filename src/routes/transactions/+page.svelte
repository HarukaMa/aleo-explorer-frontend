<script lang="ts">
  import type { PageData } from "./$types"
  import Seo from "$lib/components/Seo.svelte"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Link from "$lib/components/Link.svelte"
  import Time from "$lib/components/Time.svelte"
  import Number from "$lib/components/Number.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import Decimal from "decimal.js"
  import { createAppColumnHelper } from "$lib/table"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import Status from "$lib/components/Status.svelte"
  import { StatusClass } from "$lib/types"

  let { data }: { data: PageData } = $props()

  type TransactionList = {
    transaction_id: string
    timestamp: number
    height: number | null
    transitions: number
    fee: Decimal
    type: "Deploy" | "Execute" | "Fee"
    status: "Accepted" | "Rejected" | "Unconfirmed"
  }

  let scope = $derived(data.transactions.scope)
  let total_pages = $derived(data.transactions.total_pages)
  let current_page = $derived(+data.page)
  let table_data: TransactionList[] = $derived(
    data.transactions.transactions.map((transaction) => ({
      ...transaction,
      fee: new Decimal(transaction.fee),
    })),
  )

  const column = createAppColumnHelper<TransactionList>()
  const transaction_id_definition = column.accessor("transaction_id", {
    header: "Transaction ID",
    cell: (info) => renderSnippet(transaction_id_column, info.getValue()),
  })
  const timestamp_definition = column.accessor("timestamp", {
    header: "Timestamp",
    cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
  })
  const height_definition = column.accessor("height", {
    header: "Height",
    cell: (info) => renderSnippet(height_column, info.getValue()),
  })
  const transitions_definition = column.accessor("transitions", {
    header: "Transitions",
    cell: (info) => renderComponent(Number, { number: info.getValue() }),
  })
  const fee_definition = column.accessor("fee", {
    header: "Fee",
    cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
  })
  const type_definition = column.accessor("type", {
    header: "Type",
    cell: (info) => info.getValue(),
  })
  const status_definition = column.accessor("status", {
    header: "Status",
    cell: (info) => renderSnippet(status_column, info.getValue()),
  })

  const confirmed_columns = column.columns([
    transaction_id_definition,
    timestamp_definition,
    height_definition,
    transitions_definition,
    fee_definition,
    type_definition,
    status_definition,
  ])
  const pending_columns = column.columns([
    transaction_id_definition,
    timestamp_definition,
    transitions_definition,
    fee_definition,
    type_definition,
    status_definition,
  ])
  let columns = $derived(scope === "confirmed" ? confirmed_columns : pending_columns)
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .scope-tabs {
    display: inline-flex;
    margin-top: 3rem;
  }

  .scope-tabs a {
    padding: 0.75rem 1rem;
    color: black;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;

    &:focus-visible {
      outline: 2px solid $blue-500;
      outline-offset: 2px;
    }

    &.active {
      color: $blue-500;
      background-color: $blue-50;
      border-radius: 0.5rem;
    }
  }
</style>

<Seo
  title="Aleo Transaction List | AleoScan - Aleo Blockchain Explorer"
  description="Browse confirmed and pending Aleo transactions with timestamps, block heights, transition counts, fees, types, and statuses."
/>

{#snippet transaction_id_column(value: string)}
  <span class="mono ellipsis">
    <Link href="/transaction/{value}">{value}</Link>
  </span>
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

{#snippet status_column(value: TransactionList["status"])}
  {#if value === "Accepted"}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else if value === "Rejected"}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {:else}
    <Status cls={StatusClass.Info}>Unconfirmed</Status>
  {/if}
{/snippet}

<PageHeader content="Transactions" />

<nav aria-label="Transaction scope" class="scope-tabs">
  <a
    aria-current={scope === "confirmed" ? "page" : undefined}
    class:active={scope === "confirmed"}
    href="/transactions?scope=confirmed">Confirmed</a
  >
  <a
    aria-current={scope === "pending" ? "page" : undefined}
    class:active={scope === "pending"}
    href="/transactions?scope=pending">Pending</a
  >
</nav>

<TableContainer>
  <DataTable {columns} data={table_data}>
    {#snippet emptyState()}
      <Callout title="No transactions" description="There are no transactions available." icon="list-icon" />
    {/snippet}
  </DataTable>
</TableContainer>

<TableNav
  page={current_page}
  page_href={(page_number) => `/transactions?scope=${scope}&page=${page_number}`}
  {total_pages}
/>

<PageInformation
  title="Transaction"
  description="A transaction in Aleo is an on-chain action that facilitates the transfer of credits, interaction with smart contracts, or execution of operations. Each transaction is processed by validators and added to a block. Transactions are a key component of maintaining the dynamic state of the blockchain."
  icon="transaction-icon"
/>
