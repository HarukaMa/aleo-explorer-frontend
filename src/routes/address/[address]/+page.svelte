<script lang="ts">

  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import AleoCredit from "$lib/components/AleoCredit.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Decimal from "decimal.js"
  import { type ColumnDef, createTable, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"

  let { data: server_data } = $props()
  let { data, address } = server_data

  console.log(data)

  const tab_data = [
    { title: "Recent transitions", id: "transitions" },
    { title: "Accepted solutions", id: "solutions" },
    { title: "Deployed programs", id: "programs" },
  ]

  type TransitionList = {
    height: number
    timestamp: number
    transition_id: string
    action: {
      program: string
      function: string
    }
  }

  const transition_table_data: TransitionList[] = data.transitions.map((ts: any) => {
    return {
      height: ts.block,
      timestamp: ts.timestamp,
      transition_id: ts.transition_id,
      action: {
        program: ts.program_id,
        function: ts.function_name,
      },
    }
  })

  const transition_table_columns: ColumnDef<TransitionList, any>[] = [
    {
      accessorKey: "height",
      header: "In block",
      cell: info => renderComponent(SnippetWrapper, {
        snippet: height_column,
        value: info.getValue(),
      }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: info => renderComponent(SnippetWrapper, { snippet: timestamp_column, value: info.getValue() }),
    },
    {
      accessorKey: "transition_id",
      header: "Transition ID",
      cell: info => renderComponent(SnippetWrapper, { snippet: transition_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "action",
      header: "Program / Function call",
      cell: info => renderComponent(SnippetWrapper, { snippet: action_column, value: info.getValue() }),
    },
  ]

  type SolutionList = {
    height: number
    epoch: number
    timestamp: number
    solution_id: string
    counter: Decimal
    target: {
      proof: Decimal
      sum: Decimal
    },
    reward: Decimal
  }

  const solution_table_data: SolutionList[] = data.solutions.map((solution: any) => {
    return {
      height: solution.height,
      epoch: Math.floor(solution.height / 360),
      timestamp: solution.timestamp,
      solution_id: solution.solution_id,
      counter: new Decimal(solution.counter),
      target: {
        proof: new Decimal(solution.target),
        sum: new Decimal(solution.target_sum),
      },
      reward: new Decimal(solution.reward),
    }
  })

  const solution_table_columns: ColumnDef<SolutionList, any>[] = [
    {
      accessorKey: "height",
      header: "In block",
      cell: info => renderComponent(SnippetWrapper, { snippet: height_column, value: info.getValue() }),
    },
    {
      accessorKey: "epoch",
      header: "Epoch",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: info => renderComponent(SnippetWrapper, { snippet: timestamp_column, value: info.getValue() }),
    },
    {
      accessorKey: "solution_id",
      header: "Solution ID",
      cell: info => renderComponent(SnippetWrapper, { snippet: solution_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "counter",
      header: "Counter",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: info => renderComponent(SnippetWrapper, { snippet: target_column, value: info.getValue() }),
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: info => renderComponent(AleoCredit, { number: info.getValue() }),
    },
  ]

  const solution_table = createTable<SolutionList>({
    data: solution_table_data,
    columns: solution_table_columns,
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

    .address-icon {
      height: 32px;
      width: 32px;
      background-image: $address-icon;
    }

    .address-num {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .address-title {
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

{#snippet target_column(value)}
  <Number number={value.proof} />
  <span class="dim">
    / <Number number={value.sum} />
  </span>
{/snippet}

{#snippet before_container()}
  <!-- TODO validator -->
  <div class="header">
    <div class="flex">
      <div class="address-icon"></div>
      <div class="vert">
        <div class="block-title">Address</div>
        <div class="block-num">
          <UIAddress address={address} name_data={data.resolved_addresses} short_address />
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="details">
  <div class="group">
    <DetailLine label="Address">
      <span class="mono">{data.address}</span>
    </DetailLine>
    <DetailLine label="Public credits">
      <AleoCredit number={data.public_balance} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    {#if data.bond_state}
      <DetailLine label="Not implemented">

      </DetailLine>
    {/if}
    <DetailLine label="Lifetime stake reward">
      <AleoCredit number={data.stake_reward} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Public credits received">
      <AleoCredit number={data.transfer_in} suffix={true}></AleoCredit>
    </DetailLine>
    <DetailLine label="Public credits sent">
      <AleoCredit number={data.transfer_out} suffix={true}></AleoCredit>
    </DetailLine>
    <DetailLine label="Total fee spent">
      <AleoCredit number={data.fee} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Programs deployed">
      <Number number={data.programs.length} />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Accepted puzzle solutions">
      <Number number={data.total_solutions} />
    </DetailLine>
    <DetailLine label="Lifetime puzzle reward">
      <AleoCredit number={data.total_rewards} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
</div>


<Tabs {tab_data}>
  {#snippet transitions(binds)}
    <div class="tab" bind:this={binds.transitions}>
      A
    </div>
  {/snippet}
  {#snippet solutions(binds)}
    <div class="tab" bind:this={binds.solutions}>
      B
    </div>
  {/snippet}
  {#snippet programs(binds)}
    <div class="tab" bind:this={binds.programs}>
      C
    </div>
  {/snippet}
</Tabs>