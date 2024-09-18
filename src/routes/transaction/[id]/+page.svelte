<script lang="ts">
  import { type BeforeContainerState, StatusClass } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import { format_time, format_time_absolute_relative, TimeMode } from "$lib/time_mode.svelte.js"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import { type ColumnDef, createTable, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import Fee from "$lib/components/Fee.svelte"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  $inspect(data)

  let state = $derived(data.state)
  let type = $derived(data.type)

  const tab_data = [
    { title: "Transitions", id: "transitions" },
    { title: "Mapping operations", id: "mapping" },
    // { title: "Finalize call graph", id: "finalize-call" },
  ]

  type TransitionList = {
    index: string
    transition_id: string
    action: { program: string; function: string }
  }

  let transitions = $derived.by(() => {
    if (type === "Execute") {
      if (state === "Accepted") {
        const tx = data.confirmed_transaction.transaction
        let list = tx.execution.transitions
        if (tx.fee) {
          list.push(tx.fee.transition)
        }
        return list
      } else if (state === "Rejected") {
        return [data.confirmed_transaction.fee.transition]
      } else {
        let list = data.transaction.execution.transitions
        if (data.transaction.fee) {
          list.push(data.transaction.fee.transition)
        }
        return list
      }
    } else if (type === "Deploy") {
      if (data.confirmed_transaction) {
        return [data.confirmed_transaction.transaction.fee.transition]
      } else {
        return [data.transaction.fee.transition]
      }
    } else {
      return []
    }
  })

  let transition_table_data: TransitionList[] = $derived(
    transitions.map((transition: any, index: number) => {
      let display_index = index.toString()
      if (
        index === transitions.length - 1 &&
        transition.program_id === "credits.aleo" &&
        transition.function_name.startsWith("fee_")
      ) {
        display_index = "Fee"
      }
      return {
        index: display_index,
        transition_id: transition.transition_id,
        action: {
          program: transition.program_id,
          function: transition.function_name,
        },
      }
    }),
  )

  const transition_table_columns: ColumnDef<TransitionList, any>[] = [
    {
      accessorKey: "index",
      header: "Index",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "transition_id",
      header: "Transition ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: transition_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: action_column, value: info.getValue() }),
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
  @import "static/styles/variables";

  div.header {
    display: flex;
    flex-direction: row;
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

    .flex {
      display: inline-flex;
      justify-content: left;
      align-items: center;
      gap: 1rem;
    }

    .transaction-icon {
      height: 32px;
      width: 32px;
      background-image: $block-icon;
    }

    .transaction-id {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .transaction-title {
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
  }
</style>

{#snippet transaction_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transaction/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet solution_id_column(value)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet address_column(value)}
  <div class="mono ellipsis">
    <Link href="/address/{value}" content={value}>
      <UIAddress address={value} name_data={block.resolved_addresses} />
    </Link>
  </div>
{/snippet}

{#snippet target_column(value)}
  <Number number={value} />
  <span class="dim">
    / <Number number={total_target} />
  </span>
{/snippet}

{#snippet action_column(value)}
  {#if value.function === undefined}
    <Link href="/program/{value.program}">
      <span class="mono">{value.program}</span>
    </Link>
  {:else}
    <div class="column">
      <span class="mono">{value.function}</span>
      <Link href="/program/{value.program}">
        <span class="secondary mono">{value.program}</span>
      </Link>
    </div>
  {/if}
{/snippet}

{#snippet status_column(value)}
  {#if value === "accepted"}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {/if}
{/snippet}

{#snippet before_container()}
  <div class="header">
    <div class="flex">
      <div class="transaction-icon"></div>
      <div class="vert">
        <div class="transaction-title">Transaction</div>
        <div class="transaction-id">
          {data.tx_id.slice(0, 11) + "..." + data.tx_id.slice(-6)}
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="details">
  <div class="group">
    <DetailLine label="Transaction ID">
      <span class="mono">{data.tx_id}</span>
    </DetailLine>
    {#if data.state != "Unconfirmed"}
      <DetailLine label="Block">
        {#if data.first_seen < data.block_confirm_time}
          <div class="column">
            <Link href="/block/{data.height}">
              <Number number={data.height} />
            </Link>
            <span class="secondary">
              {#if data.state === "Accepted"}
                Confirmed
              {:else if data.state === "Rejected"}
                Rejected
              {:else if data.state === "Aborted"}
                Aborted
              {/if}
              {format_time_absolute_relative(data.block_confirm_time - data.first_seen, false)}
            </span>
          </div>
        {:else}
          <Link href="/block/{data.height}">
            <Number number={data.height} />
          </Link>
        {/if}
      </DetailLine>
      <DetailLine label="Timestamp">
        {format_time(new Date(data.block_timestamp * 1000), TimeMode.Relative)}
        <!-- @formatter:off -->
        (<Time timestamp={data.block_timestamp} />)
        <!-- @formatter:on -->
      </DetailLine>
    {:else}
      <DetailLine label="First seen">
        {format_time(new Date(data.first_seen * 1000), TimeMode.Relative)}
        <!-- @formatter:off -->
        (<Time timestamp={data.first_seen} />)
        <!-- @formatter:on -->
      </DetailLine>
    {/if}
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Status">
      {#if state === "Accepted"}
        <Status cls={StatusClass.Success}>Accepted</Status>
      {:else if state === "Rejected"}
        <Status cls={StatusClass.Danger}>Rejected</Status>
      {:else if state === "Aborted"}
        <Status cls={StatusClass.Danger}>Aborted</Status>
      {:else}
        <Status cls={StatusClass.Info}>Unconfirmed</Status>
      {/if}
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
</div>

<Tabs {tab_data}>
  {#snippet transitions(binds)}
    <div class="tab" bind:this={binds.transitions}>A</div>
  {/snippet}
  {#snippet mapping(binds)}
    <div class="tab" bind:this={binds.mapping}>B</div>
  {/snippet}
</Tabs>
