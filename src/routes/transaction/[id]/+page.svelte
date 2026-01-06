<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { type BeforeContainerState, StatusClass } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import { format_time, format_time_absolute_relative, TimeMode } from "$lib/time_mode.svelte.js"
  import Tabs from "$lib/components/Tabs.svelte"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"
  import AleoToken from "$lib/components/AleoToken.svelte"
  import FeeBreakdown from "$lib/components/FeeBreakdown.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  $inspect(data)

  let state = $derived(data.state)
  let type = $derived(data.type)

  // Transfer details logic
  const TRANSFER_ACTIONS = [
    "transfer_public",
    "transfer_public_to_private",
    "transfer_private_to_public",
    "transfer_private",
  ]

  type TransferDetails = {
    amount: string
    from: string | null // null means Private
    to: string | null // null means Private
  } | null

  let transferDetails: TransferDetails = $derived.by(() => {
    if (type !== "Execute") return null

    // Use same pattern as the existing transitions derivation
    const transaction = data.confirmed_transaction?.transaction ?? data.transaction
    if (!transaction?.execution?.transitions) return null

    const txTransitions = transaction.execution.transitions
    if (txTransitions.length !== 1) return null

    const transition = txTransitions[0]
    if (transition.program_id !== "credits.aleo") return null
    if (!TRANSFER_ACTIONS.includes(transition.function_name)) return null

    // Get the future from the last output
    const outputs = transition.outputs
    if (!outputs || outputs.length === 0) return null

    const lastOutput = outputs[outputs.length - 1]
    const future = lastOutput?.future?.value ?? lastOutput?.future ?? lastOutput?.value
    if (!future?.arguments) return null

    const args = future.arguments
    const action = transition.function_name

    // Amount is always the last argument (remove u64 suffix if present)
    const amountArg = args[args.length - 1]
    const amount =
      typeof amountArg === "string"
        ? amountArg.replace("u64", "").replace(/[^\d]/g, "")
        : String(amountArg)

    let from: string | null = null
    let to: string | null = null

    switch (action) {
      case "transfer_public":
        // from: arg[0], to: arg[1]
        from = args[0]
        to = args[1]
        break
      case "transfer_public_to_private":
        // from: arg[0], to: Private
        from = args[0]
        to = null
        break
      case "transfer_private_to_public":
        // from: Private, to: arg[0]
        from = null
        to = args[0]
        break
      case "transfer_private":
        // from: Private, to: Private
        from = null
        to = null
        break
    }

    return { amount, from, to }
  })

  const tab_data = [
    { title: "Transitions", id: "transitions" },
    { title: "Mapping operations", id: "mapping" },
    // { title: "Finalize call graph", id: "finalize-call" },
  ]

  let fee = $derived.by(() => {
    if (state === "Unconfirmed") {
      return data.transaction.fee
    } else {
      return data.confirmed_transaction.transaction.fee
    }
  })

  type TransitionList = {
    index: string
    transition_id: string
    action: { program: string; function: string }
    status: string
  }

  let transitions = $derived.by(() => {
    switch (type) {
      case "Execute": {
        const currentState = state ?? "Unconfirmed"
        const transaction = data.confirmed_transaction?.transaction ?? data

        if (currentState === "Rejected") {
          return [{ ...transaction.fee.transition, state: currentState }]
        }

        const transitions = [...transaction.execution.transitions]
        if (transaction.fee) {
          transitions.push(transaction.fee.transition)
        }

        return transitions.map((transition) => ({ ...transition, state: currentState }))
      }

      case "Deploy": {
        const transaction = data.confirmed_transaction?.transaction ?? data.transaction
        return [{ ...transaction.fee.transition, state }]
      }

      default:
        return []
    }
  })

  $inspect(transitions)

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
        transition_id: transition.id,
        action: {
          program: transition.program_id,
          function: transition.function_name,
        },
        status: transition.state,
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
    {
      accessorKey: "status",
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
    .transaction-icon {
      height: 32px;
      width: 32px;
      background-image: $transaction-icon;
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
  }

  .group {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.5rem;
    border-radius: 1rem;
    gap: 1.5rem;
    border: 1px solid $grey-100;
  }

  .group-title {
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
  }

  .group-separator {
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
    background-color: $grey-100;
  }

  .group-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
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

  .private-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .lock-icon {
      width: 20px;
      height: 20px;
      background-image: $lock-icon;
    }
  }
</style>

<Seo
  title="Aleo Transaction {data.tx_id} | AleoScan - Aleo Blockchain Explorer"
  description="Explore Aleo transaction {data.tx_id}. View sender, recipient, status, gas fees, and block height."
/>

{#snippet transition_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
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

{#snippet status_column(value)}
  {#if value?.startsWith("Accepted")}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else if value?.startsWith("Rejected")}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {:else}
    <Status cls={StatusClass.Warning}>Unknown</Status>
  {/if}
{/snippet}

{#snippet privateIndicator()}
  <div class="private-indicator">
    <div class="lock-icon"></div>
    <span>Private</span>
  </div>
{/snippet}

<div class="container">
  <div class="details">
    {#if transferDetails}
      <div class="group">
        <p class="group-title">Transfer details</p>
        <div class="group-content">
          <DetailLine tooltip="The amount of ALEO credits transferred" label="Transfer amount">
            <strong class="aleo-token"><AleoToken number={transferDetails.amount} suffix /></strong>
          </DetailLine>
          <div class="group-separator"></div>
          <DetailLine tooltip="The sender address" label="From">
            {#if transferDetails.from === null}
              {@render privateIndicator()}
            {:else}
              <Link href="/address/{transferDetails.from}">
                <span class="mono">{transferDetails.from}</span>
              </Link>
            {/if}
          </DetailLine>
          <DetailLine tooltip="The recipient address" label="To">
            {#if transferDetails.to === null}
              {@render privateIndicator()}
            {:else}
              <Link href="/address/{transferDetails.to}">
                <span class="mono">{transferDetails.to}</span>
              </Link>
            {/if}
          </DetailLine>
        </div>
      </div>
    {/if}

    <div class="group">
      <p class="group-title">General information</p>
      <div class="group-content">
        <DetailLine tooltip="Tooltip" label="Transaction ID">
          <span class="mono">{data.tx_id}</span>
        </DetailLine>
        {#if state === "Rejected"}
          <DetailLine tooltip="Tooltip" label="Original transaction ID">
            <span class="mono">{data.original_txid}</span>
          </DetailLine>
        {/if}
        {#if state !== "Unconfirmed"}
          <DetailLine tooltip="Tooltip" label="Block">
            {#if data.first_seen < data.block_confirm_time}
              <div class="column">
                <Link href="/block/{data.height}">
                  <Number number={data.height} />
                </Link>
                <span class="secondary">
                  {#if state === "Accepted"}
                    Confirmed
                  {:else if state === "Rejected"}
                    Rejected
                  {:else if state === "Aborted"}
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
          <DetailLine tooltip="Tooltip" label="Timestamp">
            {format_time(new Date(data.block_timestamp * 1000), TimeMode.Relative)}
            <!-- @formatter:off -->
            (<Time timestamp={data.block_timestamp} />)
            <!-- @formatter:on -->
          </DetailLine>
        {:else}
          <DetailLine tooltip="Tooltip" label="First seen">
            {format_time(new Date(data.first_seen * 1000), TimeMode.Relative)}
            <!-- @formatter:off -->
            (<Time timestamp={data.first_seen} />)
            <!-- @formatter:on -->
          </DetailLine>
        {/if}
        <div class="group-separator"></div>
        <DetailLine tooltip="Tooltip" label="Status">
          {#if state === "Accepted"}
            <Status cls={StatusClass.Success}>Accepted</Status>
          {:else if state === "Rejected"}
            <div class="column">
              <Status cls={StatusClass.Danger}>Rejected</Status>
              {data.reject_reason}
            </div>
          {:else if state === "Aborted"}
            <Status cls={StatusClass.Danger}>Aborted</Status>
          {:else}
            <Status cls={StatusClass.Info}>Unconfirmed</Status>
          {/if}
        </DetailLine>
        <div class="group-separator"></div>
        <DetailLine tooltip="Tooltip" label="Type">
          {type}
        </DetailLine>
        {#if type === "Deploy"}
          <DetailLine tooltip="Tooltip" label="Program">
            {#if state === "Accepted"}
              <Link href="/program/{data.confirmed_transaction.transaction.deployment.program.id}">
                <span class="mono">{data.confirmed_transaction.transaction.deployment.program.id}</span>
              </Link>
            {:else if state === "Rejected"}
              <Link href="/program/{data.confirmed_transaction.rejected.deployment.program.id}">
                <span class="mono">{data.confirmed_transaction.rejected.deployment.program.id}</span>
              </Link>
            {:else}
              Not implemented
            {/if}
          </DetailLine>
          <DetailLine tooltip="Tooltip" label="Edition">
            {#if state === "Accepted"}
              {data.confirmed_transaction.transaction.deployment.edition}
            {:else if state === "Rejected"}
              {data.confirmed_transaction.rejected.deployment.edition}
            {:else}
              Not implemented
            {/if}
          </DetailLine>
        {/if}
        {#if state === "Accepted" || state === "Rejected"}
          <DetailLine tooltip="Tooltip" label="Index">
            {data.confirmed_transaction.index}
          </DetailLine>
        {/if}
        <div class="group-separator"></div>
        {#if fee}
          <DetailLine tooltip="Tooltip" label="Total fee spent">
            <AleoToken number={fee.amount[0] + fee.amount[1]} suffix />
          </DetailLine>
          <div class="group-separator"></div>
          <DetailLine tooltip="Tooltip" label="Breakdown">
            <div class="fee-breakdown">
              <FeeBreakdown amount={fee.amount[0]} label="Base fee"></FeeBreakdown>
              <FeeBreakdown amount={fee.amount[1]} label="Priority fee"></FeeBreakdown>
            </div>
          </DetailLine>
        {:else}
          <DetailLine tooltip="Tooltip" label="Total fee spent">
            <AleoToken number="10000" suffix />
          </DetailLine>
          <div class="group-separator"></div>
          <DetailLine tooltip="Tooltip" label="Breakdown">
            <div class="fee-breakdown">
              <FeeBreakdown amount="10000" label="Base fee"></FeeBreakdown>
              <FeeBreakdown amount="0" label="Priority fee"></FeeBreakdown>
            </div>
          </DetailLine>
        {/if}
      </div>
    </div>
  </div>

  <Tabs {tab_data}>
    {#snippet transitions(binds)}
      <div class="tab" bind:this={binds.transitions}>
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
        {#if state === "Rejected" && type === "Execute"}
          <div class="aborted-header">Rejected transitions</div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Transition ID</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {#each data.confirmed_transaction.rejected.execution.transitions as transition, index}
                  <tr>
                    <td>{index}</td>
                    <td>
                      <Link href="/transition/{transition.id}">
                        <span class="mono">{transition.id}</span>
                      </Link>
                    </td>
                    <td>
                      <div class="column">
                        <span class="mono">{transition.function_name}</span>
                        <Link href="/program/{transition.program_id}">
                          <span class="secondary mono">{transition.program_id}</span>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div class="column">
                        {#if transition.status.startsWith("Accepted")}
                          <Status cls={StatusClass.Success}>Accepted</Status>
                        {:else if transition.status.startsWith("Rejected")}
                          <Status cls={StatusClass.Danger}>Rejected</Status>
                        {:else}
                          <Status cls={StatusClass.Warning}>Unknown</Status>
                        {/if}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/snippet}
    {#snippet mapping(binds)}
      <div class="tab" bind:this={binds.mapping}>
        <div class="mapping-operations">
          {#if state === "Accepted" || state === "Rejected"}
            {#each data.mapping_operations as op}
              <div class="operation">
                <div class="column">
                  <span class="dim">Program</span>
                  <Link href="/program/{op.program_id}">
                    <span class="mono">{op.program_id}</span>
                  </Link>
                </div>
                <div class="column">
                  <span class="dim">Mapping</span>
                  <span class="mono">{op.mapping_name}[{op.key}]</span>
                </div>
                <div class="column">
                  <span class="dim">Before</span>
                  {#if op.limited_tracked}
                    <Status cls={StatusClass.Warning}>Not tracked</Status>
                  {:else if op.previous_value === null}
                    <Status cls={StatusClass.Info}>New</Status>
                  {:else}
                    <span class="mono">{op.previous_value}</span>
                  {/if}
                </div>
                <div class="column">
                  <span class="dim">After</span>
                  {#if op.type === "Remove"}
                    <Status cls={StatusClass.Danger}>Removed</Status>
                  {:else}
                    <span class="mono">{op.value}</span>
                  {/if}
                </div>
              </div>
            {/each}
          {:else}{/if}
        </div>
      </div>
    {/snippet}
  </Tabs>

  <PageInformation
    title="Transaction"
    description="A transaction in Aleo is an on-chain action that facilitates the transfer of credits, interaction with smart contracts, or execution of operations. Each transaction is processed by validators and added to a block. Transactions are a key component of maintaining the dynamic state of the blockchain."
    icon="transaction-icon"
  />
</div>
