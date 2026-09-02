<script lang="ts">
  import { getContext } from "svelte"
  import Seo from "$lib/components/Seo.svelte"
  import { StatusClass } from "$lib/types"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import { format_time_absolute_relative } from "$lib/time_mode.svelte.js"
  import Tabs from "$lib/components/Tabs.svelte"
  import { renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import { createAppColumnHelper } from "$lib/table"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"
  import AleoToken from "$lib/components/AleoToken.svelte"
  import FeeBreakdown from "$lib/components/FeeBreakdown.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import { tooltips } from "$lib/tooltips"
  import Decimal from "decimal.js"
  import aleo_logo from "$lib/assets/images/icons/aleo-logo.svg"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  let aleo_price = getContext<{ price: number }>("aleo_price")

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
      typeof amountArg === "string" ? amountArg.replace("u64", "").replace(/[^\d]/g, "") : String(amountArg)

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

  let split_fee = $derived(new Decimal(data.split_fee))
  let total_fee_spent = $derived(new Decimal(data.total_fee).add(split_fee))

  type TransitionList = {
    index: string
    transition_id: string
    action: { program: string; function: string | undefined }
    status: string
  }

  let transitions = $derived.by(() => {
    if (type === "Execute") {
      if (state === "Accepted") {
        const tx = data.confirmed_transaction.transaction
        let list = [...tx.execution.transitions]
        if (tx.fee) {
          list.push(tx.fee.transition)
        }
        return list
      } else if (state === "Rejected") {
        return [
          ...data.confirmed_transaction.rejected.execution.transitions,
          data.confirmed_transaction.transaction.fee.transition,
        ]
      } else {
        let list = [...data.transaction.execution.transitions]
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
      let status = state

      if (
        index === transitions.length - 1 &&
        transition.program_id === "credits.aleo" &&
        transition.function_name.startsWith("fee_")
      ) {
        display_index = "Fee"
        status = "Accepted"
      }

      return {
        index: display_index,
        transition_id: transition.id,
        action: {
          program: transition.program_id,
          function: transition.function_name,
        },
        status: status,
      }
    }),
  )

  const transition_column = createAppColumnHelper<TransitionList>()
  const transition_table_columns = transition_column.columns([
    transition_column.accessor("index", {
      header: "Index",
      cell: (info) => info.getValue(),
    }),
    transition_column.accessor("transition_id", {
      header: "Transition ID",
      cell: (info) => renderSnippet(transition_id_column, info.getValue()),
    }),
    transition_column.accessor("action", {
      header: "Action",
      cell: (info) => renderSnippet(action_column, info.getValue()),
    }),
    transition_column.accessor("status", {
      header: "Status",
      cell: (info) => renderSnippet(status_column, info.getValue()),
    }),
  ])
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .details {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }

  .group {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    width: 100%;
    border-radius: 1rem;
    gap: 1.5rem;
    border: 1px solid $grey-100;
    box-sizing: border-box;
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

  .tab {
    margin-top: 2rem;
  }

  .ellipsis {
    max-width: 30vw;
    overflow: hidden;
    text-overflow: ellipsis;
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

  .transfer-type-badge {
    height: 1.25rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: center;
    padding: 2px 0.75rem;
    border: 1px solid $grey-100;
    border-radius: 100px;
  }

  .transfer-amount-display {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .amount-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }

  .aleo-logo {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.25rem;
  }

  .amount-secondary {
    font-size: 14px;
    color: $grey-600;
    margin-top: 0.25rem;
    line-height: 1;
  }
</style>

<Seo
  title="Aleo Transaction {data.tx_id} | AleoScan - Aleo Blockchain Explorer"
  description="Explore Aleo transaction {data.tx_id}. View sender, recipient, status, gas fees, and block height."
/>

{#snippet transition_id_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet action_column(value: { program: string; function: string | undefined })}
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

{#snippet status_column(value: string)}
  {#if value?.startsWith("Accepted")}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else if value?.startsWith("Rejected")}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {:else}
    <Status cls={StatusClass.Info}>Unconfirmed</Status>
  {/if}
{/snippet}

{#snippet privateIndicator()}
  <div class="private-indicator">
    <div class="lock-icon"></div>
    <span>Private</span>
  </div>
{/snippet}

<PageHeader
  content={data.tx_id.slice(0, 11) + "..." + data.tx_id.slice(-6)}
  icon="transaction-icon"
  title="Transaction"
/>

<div class="details">
  {#if transferDetails}
    <div class="group">
      <p class="group-title">Transfer details</p>
      <div class="group-content">
        <div class="transfer-amount-display">
          <div class="amount-primary">
            {new Decimal(transferDetails.amount).div(1000000).toFixed(6)}
            <img src={aleo_logo} class="aleo-logo" alt="ALEO" />
          </div>
          {#if aleo_price.price > 0}
            <div class="amount-secondary">
              ~${(new Decimal(transferDetails.amount).div(1000000).toNumber() * aleo_price.price).toFixed(2)}
            </div>
          {/if}
        </div>
        <div class="group-separator"></div>
        <DetailLine tooltip="The sender address when it is public. Private senders are hidden." label="From">
          {#if transferDetails.from === null}
            {@render privateIndicator()}
          {:else}
            <Link href="/address/{transferDetails.from}">
              <span class="mono">{transferDetails.from}</span>
            </Link>
          {/if}
        </DetailLine>
        <DetailLine tooltip="The recipient address when it is public. Private recipients are hidden." label="To">
          {#if transferDetails.to === null}
            {@render privateIndicator()}
          {:else}
            <Link href="/address/{transferDetails.to}">
              <span class="mono">{transferDetails.to}</span>
            </Link>
          {/if}
        </DetailLine>
        <div class="group-separator"></div>
        <DetailLine tooltip={tooltips.transaction.transferType} label="Transfer Type">
          <div class="transfer-type-badge">
            {transferDetails.from === null ? "Private" : "Public"} to {transferDetails.to === null
              ? "Private"
              : "Public"}
          </div>
        </DetailLine>
      </div>
    </div>
  {/if}

  <div class="group">
    <p class="group-title">General information</p>
    <div class="group-content">
      <DetailLine label="Transaction ID" tooltip={tooltips.transaction.transactionId}>
        <span class="mono">{data.tx_id}</span>
      </DetailLine>
      {#if state === "Rejected"}
        <DetailLine label="Original transaction ID">
          <span class="mono">{data.original_txid}</span>
        </DetailLine>
      {/if}
      {#if state !== "Unconfirmed"}
        <DetailLine tooltip={tooltips.transaction.block} label="Block">
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
        <DetailLine tooltip={tooltips.transaction.timestamp} label="Timestamp">
          <Time relative timestamp={data.block_timestamp} />
          <!-- @formatter:off -->
          (<Time no_relative timestamp={data.block_timestamp} />)
          <!-- @formatter:on -->
        </DetailLine>
      {:else}
        <DetailLine label="First seen">
          <Time relative timestamp={data.first_seen} />
          <!-- @formatter:off -->
          (<Time no_relative timestamp={data.first_seen} />)
          <!-- @formatter:on -->
        </DetailLine>
      {/if}
      <div class="group-separator"></div>
      <DetailLine label="Status" tooltip={tooltips.transaction.status}>
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
      <DetailLine label="Type" tooltip={tooltips.transaction.type}>
        {type}
      </DetailLine>
      {#if type === "Deploy"}
        <DetailLine label="Program">
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
        <DetailLine label="Edition">
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
        <DetailLine tooltip={tooltips.transaction.index} label="Index">
          {data.confirmed_transaction.index}
        </DetailLine>
      {/if}
      <div class="group-separator"></div>
      <DetailLine label="Total fee spent" tooltip={tooltips.transaction.totalFeeSpent}>
        <AleoToken number={total_fee_spent} suffix />
      </DetailLine>
      <div class="group-separator"></div>
      <DetailLine label="Breakdown" tooltip={tooltips.transaction.breakdown}>
        <div class="fee-breakdown">
          {#if state === "Accepted" && type === "Execute"}
            <FeeBreakdown label="Base fee">
              <FeeBreakdown amount={data.storage_cost} label="Storage cost"></FeeBreakdown>
              {#if data.finalize_costs.length > 1}
                <FeeBreakdown label="Finalize costs">
                  {#each data.finalize_costs as cost, index}
                    <FeeBreakdown amount={cost} label="Transition #{index + 1}"></FeeBreakdown>
                  {/each}
                </FeeBreakdown>
              {:else}
                <FeeBreakdown amount={data.finalize_cost} label="Finalize cost"></FeeBreakdown>
              {/if}
              <FeeBreakdown amount={data.burnt_fee} label="Burnt credits"></FeeBreakdown>
            </FeeBreakdown>
          {:else if state === "Accepted" && type === "Deploy"}
            <FeeBreakdown label="Base fee">
              <FeeBreakdown amount={data.storage_cost} label="Storage cost"></FeeBreakdown>
              <FeeBreakdown amount={data.synthesis_cost} label="Synthesis cost"></FeeBreakdown>
              <FeeBreakdown amount={data.constructor_cost} label="Constructor cost"></FeeBreakdown>
              <FeeBreakdown amount={data.namespace_cost} label="Namespace cost"></FeeBreakdown>
              <FeeBreakdown amount={data.burnt_fee} label="Burnt credits"></FeeBreakdown>
            </FeeBreakdown>
          {:else}
            <FeeBreakdown amount={data.base_fee} label="Base fee"></FeeBreakdown>
          {/if}
          <FeeBreakdown amount={data.priority_fee} label="Priority fee"></FeeBreakdown>
          {#if split_fee.gt(0)}
            <FeeBreakdown amount={split_fee} label="Split fee"></FeeBreakdown>
          {/if}
        </div>
      </DetailLine>
    </div>
  </div>
</div>

{#snippet transitions_panel()}
  <div class="tab">
    <TableContainer>
      <DataTable columns={transition_table_columns} data={transition_table_data}>
        {#snippet emptyState()}
          <Callout title="No transitions" description="This transaction has no transitions." icon="list-icon" />
        {/snippet}
      </DataTable>
    </TableContainer>
  </div>
{/snippet}
{#snippet mapping()}
  <div class="tab">
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
<Tabs
  tabs={[
    { title: "Transitions", id: "transitions", content: transitions_panel },
    { title: "Mapping operations", id: "mapping", content: mapping },
  ]}
/>

<PageInformation
  title="Transaction"
  description="A transaction in Aleo is an on-chain action that facilitates the transfer of credits, interaction with smart contracts, or execution of operations. Each transaction is processed by validators and added to a block. Transactions are a key component of maintaining the dynamic state of the blockchain."
  icon="transaction-icon"
/>
