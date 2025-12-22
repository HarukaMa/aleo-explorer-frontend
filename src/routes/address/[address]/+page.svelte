<script lang="ts">
  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Decimal from "decimal.js"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import Time from "$lib/components/Time.svelte"

  let { data: server_data } = $props()
  let { data, address } = $derived(server_data)

  $inspect(data)

  let resolved = $derived(data.resolved_addresses[address])

  let bonded_to = $derived(data.resolved_addresses[data.bond_state?.validator])

  let tab_data = $derived.by(() => {
    let tabs = [
      { title: "Recent transitions", id: "transitions" },
      { title: "Accepted solutions", id: "solutions" },
      { title: "Deployed programs", id: "programs" },
    ]
    if (data.delegated > 0) {
      tabs.splice(0, 0, { title: "Top delegators", id: "delegators" })
    }
    return tabs
  })

  type TransitionList = {
    height: number
    timestamp: number
    transition_id: string
    action: {
      program: string
      function: string
    }
  }

  let transition_table_data: TransitionList[] = $derived(
    data.transitions.map((ts: any) => {
      return {
        height: ts.height,
        timestamp: ts.timestamp,
        transition_id: ts.transition_id,
        action: {
          program: ts.program_id,
          function: ts.function_name,
        },
      }
    }),
  )

  const transition_table_columns: ColumnDef<TransitionList, any>[] = [
    {
      accessorKey: "height",
      header: "In block",
      cell: (info) =>
        renderComponent(SnippetWrapper, {
          snippet: height_column,
          value: info.getValue(),
        }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: timestamp_column, value: info.getValue() }),
    },
    {
      accessorKey: "transition_id",
      header: "Transition ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: transition_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "action",
      header: "Function / Program",
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

  type SolutionList = {
    height: number
    epoch: number
    timestamp: number
    solution_id: string
    counter: Decimal
    target: {
      proof: Decimal
      sum: Decimal
    }
    reward: Decimal
  }

  let solution_table_data: SolutionList[] = $derived(
    data.solutions.map((solution: any) => {
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
    }),
  )

  const solution_table_columns: ColumnDef<SolutionList, any>[] = [
    {
      accessorKey: "height",
      header: "In block",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: height_column, value: info.getValue() }),
    },
    {
      accessorKey: "epoch",
      header: "Epoch",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: timestamp_column, value: info.getValue() }),
    },
    {
      accessorKey: "solution_id",
      header: "Solution ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: solution_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "counter",
      header: "Counter",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: target_column, value: info.getValue() }),
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    },
  ]

  const solution_table = createTable<SolutionList>({
    get data() {
      return solution_table_data
    },
    columns: solution_table_columns,
    getCoreRowModel: getCoreRowModel(),
  })

  type ProgramList = {
    height: number
    program: string
    timestamp: number
    transaction_id: string
  }

  let program_table_data: ProgramList[] = $derived(
    data.programs.map((program: any) => {
      return {
        height: program.height,
        program: program.program_id,
        timestamp: program.timestamp,
        transaction_id: program.transaction_id,
      }
    }),
  )

  const program_table_columns: ColumnDef<ProgramList, any>[] = [
    {
      accessorKey: "height",
      header: "In block",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: height_column, value: info.getValue() }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: timestamp_column, value: info.getValue() }),
    },
    {
      accessorKey: "transaction_id",
      header: "Transaction ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: transaction_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "program",
      header: "Program ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: program_id_column, value: info.getValue() }),
    },
  ]

  const program_table = createTable<ProgramList>({
    get data() {
      return program_table_data
    },
    columns: program_table_columns,
    getCoreRowModel: getCoreRowModel(),
  })

  type DelegatorList = {
    address: string
    amount: string
  }

  let delegator_table_data: DelegatorList[] = $derived.by(() => {
    if (!data.address_stakes) {
      return []
    }
    return Object.entries(data.address_stakes).map(([address, amount]: [string, any]) => {
      return {
        address,
        amount,
      }
    })
  })

  const delegator_table_columns: ColumnDef<DelegatorList, any>[] = [
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: address_column, value: info.getValue() }),
    },
    {
      accessorKey: "amount",
      header: "Staked",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    },
  ]

  const delegator_table = createTable<DelegatorList>({
    get data() {
      return delegator_table_data
    },
    columns: delegator_table_columns,
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
    .address-icon {
      height: 32px;
      width: 32px;
      background-image: $address-icon;
    }

    .external-icon {
      height: 40px;
      width: 40px;

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }

    .address-data {
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

    &.mono {
      font-family: "Inconsolata Variable", monospace;
      font-size: 0.8rem;
    }
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
    white-space: nowrap;
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

  .address-warning {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem;
    background-color: $yellow-50;
    border-radius: 0.5rem;
    box-sizing: border-box;
    width: 100%;
  }

  .address-alert-icon {
    height: 1.25rem;
    width: 1.25rem;
    flex-shrink: 0;
    background-color: $yellow-600;
    mask-image: $alert-icon;
    background-repeat: no-repeat;
  }
</style>

{#snippet address_column(value)}
  <div class="mono ellipsis">
    <Link href="/address/{value}">
      <UIAddress address={value} name_data={data.resolved_addresses} />
    </Link>
  </div>
{/snippet}

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

{#snippet timestamp_column(value)}
  <Time timestamp={value} />
{/snippet}

{#snippet action_column(value)}
  <div class="column">
    <span class="mono">{value.function}</span>
    <Link href="/program/{value.program}">
      <span class="secondary mono">{value.program}</span>
    </Link>
  </div>
{/snippet}

{#snippet transition_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
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

{#snippet transaction_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transaction/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet program_id_column(value)}
  <div class="mono">
    <Link href="/program/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet before_container()}
  <div class="header">
    <div class="flex">
      {#if resolved.logo}
        <div class="external-icon">
          <img alt={resolved.tag} src="https://r2.aleoscan.io/{resolved.logo}" />
        </div>
      {:else}
        <div class="address-icon"></div>
      {/if}
      <div class="vert">
        <div class="address-title">
          {#if data && data.committee_state}Validator{:else}Address{/if}
        </div>
        <div class="address-data">
          <UIAddress {address} name_data={data.resolved_addresses} short_address keep_font />
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="details">
  {#if data.program_name}
    <div class="address-warning">
      <div class="address-alert-icon"></div>
      This is a program address. Records owned by programs are currently not spendable.
    </div>
  {/if}
  <div class="group">
    <DetailLine label="Address">
      <span class="mono">{data.address}</span>
    </DetailLine>
    {#if data.program_name}
      <DetailLine label="Program name">
        <Link href="/program/{data.program_name}">
          <span class="mono">{data.program_name}</span>
        </Link>
      </DetailLine>
    {/if}
    {#if resolved.name}
      <DetailLine label="Primary ANS name">
        {resolved.name}
      </DetailLine>
    {/if}
    {#if resolved.tag}
      <DetailLine label="Address tag">
        {resolved.tag}
      </DetailLine>
    {/if}
    {#if resolved.link}
      <DetailLine label="Website">
        <Link href={resolved.link} content={resolved.link} external />
      </DetailLine>
    {/if}
    <DetailLine label="Public credits">
      <AleoCredit number={data.public_balance} suffix />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    {#if data.bond_state}
      <DetailLine label="Credits staked">
        {#if data.committee_state}
          <div class="column">
            <AleoCredit number={data.bond_state.amount} suffix />
            <span class="secondary">Staked to self</span>
          </div>
        {:else}
          <AleoCredit number={data.bond_state.amount} suffix />
        {/if}
      </DetailLine>
      {#if !data.committee_state}
        <DetailLine label="Bonded to validator">
          {#if bonded_to && (bonded_to.name || bonded_to.tag)}
            <div class="column">
              <Link href="/address/{data.bond_state.validator}" content={bonded_to.tag || bonded_to.name} />
              <span class="secondary mono">{data.bond_state.validator}</span>
            </div>
          {:else}
            <Link href="/address/{data.bond_state.validator}">
              <UIAddress address={data.bond_state.validator} name_data={data.resolved_addresses} />
            </Link>
          {/if}
        </DetailLine>
      {/if}
      <DetailLine label="Withdrawal address">
        {#if data.withdrawal_address === address}
          Self
        {:else}
          <Link href="/address/{data.withdrawal_address}">
            <UIAddress address={data.withdrawal_address} name_data={data.resolved_addresses} />
          </Link>
        {/if}
      </DetailLine>
    {/if}
    <DetailLine label="Lifetime stake reward">
      <AleoCredit number={data.stake_reward} suffix />
    </DetailLine>
  </div>
  {#if data.unbond_state}
    <div class="group">
      <div class="details-line"></div>
    </div>
    <div class="group">
      <DetailLine label="Credits unbonding">
        <AleoCredit number={data.unbond_state.amount} suffix />
      </DetailLine>
      <DetailLine label="Withdrawable at height">
        <div class="column">
          <Number number={data.unbond_state.height} />
          <span class="secondary">
            {#if data.latest_height >= data.unbond_state.height}
              Withdrawable now
            {:else}
              Withdrawable in {data.unbond_state.height - data.latest_height} blocks
            {/if}
          </span>
        </div>
      </DetailLine>
    </div>
  {/if}
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Public credits received">
      <AleoCredit number={data.transfer_in} suffix />
    </DetailLine>
    <DetailLine label="Public credits sent">
      <AleoCredit number={data.transfer_out} suffix />
    </DetailLine>
    <DetailLine label="Total fee spent">
      <AleoCredit number={data.fee} suffix />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  {#if data.committee_state}
    <div class="group">
      <DetailLine label="Credits staked">
        <AleoCredit number={data.delegated} suffix />
      </DetailLine>
      <DetailLine label="Open for staking">
        {#if data.committee_state.is_open}
          Yes
        {:else}
          No
        {/if}
      </DetailLine>
      <DetailLine label="Commission">
        {data.committee_state.commission}%
      </DetailLine>
      <DetailLine label="Uptime in last 24 hours">
        <Number number={data.uptime * 100} unit="%" precision={2} />
      </DetailLine>
    </div>
    <div class="group">
      <div class="details-line"></div>
    </div>
  {:else if data.delegated > 0}
    <div class="group">
      <DetailLine label="Credits staked">
        <AleoCredit number={data.delegated} suffix />
      </DetailLine>
    </div>
    <div class="group">
      <div class="details-line"></div>
    </div>
  {/if}
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
      <AleoCredit number={data.total_rewards} suffix />
    </DetailLine>
  </div>
</div>

<Tabs {tab_data}>
  {#snippet delegators(binds)}
    <div class="tab" bind:this={binds.delegators}>
      {#if data.delegated > 0}
        <div class="table-container">
          <table>
            <thead>
              {#each delegator_table.getHeaderGroups() as header_group}
                <tr>
                  {#each header_group.headers as header}
                    <th>{header.column.columnDef.header}</th>
                  {/each}
                </tr>
              {/each}
            </thead>
            <tbody>
              {#each delegator_table.getRowModel().rows as row}
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
      {:else}
        <Callout
          title="No delegators"
          description="This address has not staked any credits to other addresses."
          icon="list-icon"
        />
      {/if}
    </div>
  {/snippet}
  {#snippet transitions(binds)}
    <div class="tab" bind:this={binds.transitions}>
      {#if data.transitions.length === 0}
        <Callout
          title="No transitions"
          description="This address has not publicly appeared in any transition."
          icon="list-icon"
        />
      {:else}
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
      {/if}
    </div>
  {/snippet}
  {#snippet solutions(binds)}
    <div class="tab" bind:this={binds.solutions}>
      {#if data.solutions.length === 0}
        <Callout
          title="No solutions"
          description="This address has not submitted any valid puzzle solutions."
          icon="list-icon"
        />
      {:else}
        <div class="table-container">
          <table>
            <thead>
              {#each solution_table.getHeaderGroups() as header_group}
                <tr>
                  {#each header_group.headers as header}
                    <th>{header.column.columnDef.header}</th>
                  {/each}
                </tr>
              {/each}
            </thead>
            <tbody>
              {#each solution_table.getRowModel().rows as row}
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
    </div>
  {/snippet}
  {#snippet programs(binds)}
    <div class="tab" bind:this={binds.programs}>
      {#if data.programs.length === 0}
        <Callout title="No programs" description="This address has not deployed any programs." icon="list-icon" />
      {:else}
        <div class="table-container">
          <table>
            <thead>
              {#each program_table.getHeaderGroups() as header_group}
                <tr>
                  {#each header_group.headers as header}
                    <th>{header.column.columnDef.header}</th>
                  {/each}
                </tr>
              {/each}
            </thead>
            <tbody>
              {#each program_table.getRowModel().rows as row}
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
    </div>
  {/snippet}
</Tabs>
