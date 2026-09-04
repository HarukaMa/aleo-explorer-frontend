<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { StatusClass } from "$lib/types"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import Chip from "$lib/components/Chip.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Decimal from "decimal.js"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Fee from "$lib/components/Fee.svelte"
  import { createAppColumnHelper } from "$lib/table"
  import Link from "$lib/components/Link.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import Status from "$lib/components/Status.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import { program_url } from "$lib/utils"

  let { data } = $props()
  let { block, height } = $derived(data)

  let ratifications = $derived(block.block.ratifications)

  let rewards = $derived.by(() => {
    let block_reward = new Decimal(0)
    let puzzle_reward = new Decimal(0)
    for (let ratify of ratifications) {
      if (ratify.type === "block_reward") {
        block_reward = new Decimal(ratify.amount)
      } else if (ratify.type === "puzzle_reward") {
        puzzle_reward = new Decimal(ratify.amount)
      }
    }
    return {
      block: block_reward,
      puzzle: puzzle_reward,
    }
  })

  let total_fee = $derived.by(() => {
    let base = new Decimal(0)
    let priority = new Decimal(0)
    let burnt = new Decimal(0)
    let split = new Decimal(0)
    for (const tx of block.block.transactions) {
      const fee = block.fee_breakdowns[tx.transaction.id]
      base = base.add(fee.minimum_fee)
      priority = priority.add(fee.priority_fee)
      burnt = burnt.add(fee.burnt_fee)
      split = split.add(fee.split_fee)
    }
    return { base, priority, burnt, split }
  })

  let validator_showing = $state(false)

  function toggle_validators() {
    validator_showing = !validator_showing
    const toggle = document.getElementById("validator-toggle")
    if (toggle === null) return
    if (validator_showing) {
      toggle.innerText = "(Hide validators)"
    } else {
      toggle.innerText = "(Show validators)"
    }
  }

  let solution_targets = $derived(block.solutions.map((solution: any) => new Decimal(solution.target)))
  let total_target = $derived(
    solution_targets.reduce((acc: Decimal, target: Decimal) => acc.add(target), new Decimal(0)),
  )

  type BlockTransition = {
    program_id: string
    function_name: string
  }

  type BlockFee = {
    transition: unknown | null
    amount: [Decimal.Value, Decimal.Value]
  }

  type BlockTransaction =
    | {
    index: number
    type: "accepted_execute"
    transaction: {
      id: string
      execution: { transitions: BlockTransition[] }
      fee: BlockFee | null
    }
  }
    | {
    index: number
    type: "accepted_deploy"
    transaction: {
      id: string
      deployment: { edition: number; program: { id: string } }
      fee: BlockFee
    }
  }
    | {
    index: number
    type: "rejected_execute"
    transaction: { id: string; fee: BlockFee }
    rejected: { execution: { transitions: BlockTransition[] } }
  }
    | {
    index: number
    type: "rejected_deploy"
    transaction: { id: string; fee: BlockFee }
    rejected: { deployment: { edition: number; program: { id: string } } }
  }

  function get_last_transition(transitions: BlockTransition[]) {
    const transition = transitions.at(-1)
    if (!transition) throw new Error("Execution has no transitions")
    return transition
  }

  type FeeAmounts = {
    base: Decimal
    priority: Decimal
    burnt: Decimal
    split: Decimal
  }

  type TransactionList = {
    index: number
    transaction_id: string
    transitions: number
    action: { program: string; function: string | undefined; edition: number | null; transaction_index: number }
    fee: FeeAmounts
    type: string
    status: string
  }

  let transaction_table_data: TransactionList[] = $derived(
    block.block.transactions.map((tx: BlockTransaction) => {
      const breakdown = block.fee_breakdowns[tx.transaction.id]
      const fee = {
        base: new Decimal(breakdown.minimum_fee),
        priority: new Decimal(breakdown.priority_fee),
        burnt: new Decimal(breakdown.burnt_fee),
        split: new Decimal(breakdown.split_fee),
      }
      let transitions = 0
      let action: TransactionList["action"] = {
        program: "",
        function: "",
        edition: null,
        transaction_index: tx.index,
      }
      let [status, type] = tx.type.split("_")
      if (tx.type === "accepted_execute") {
        transitions = tx.transaction.execution.transitions.length
        const action_transition = get_last_transition(tx.transaction.execution.transitions)
        if (tx.transaction.fee && tx.transaction.fee.transition !== null) {
          transitions += 1
        }
        action = {
          program: action_transition.program_id,
          function: action_transition.function_name,
          edition: null,
          transaction_index: tx.index,
        }
      } else if (tx.type === "accepted_deploy") {
        transitions = 1
        action = {
          program: tx.transaction.deployment.program.id,
          function: undefined,
          edition: tx.transaction.deployment.edition,
          transaction_index: tx.index,
        }
      } else if (tx.type === "rejected_execute") {
        transitions = 1
        const action_transition = get_last_transition(tx.rejected.execution.transitions)
        action = {
          program: action_transition.program_id,
          function: action_transition.function_name,
          edition: null,
          transaction_index: tx.index,
        }
      } else if (tx.type === "rejected_deploy") {
        transitions = 1
        action = {
          program: tx.rejected.deployment.program.id,
          function: undefined,
          edition: tx.rejected.deployment.edition,
          transaction_index: tx.index,
        }
      }
      type = type.charAt(0).toUpperCase() + type.slice(1)
      return {
        index: tx.index,
        transaction_id: tx.transaction.id,
        transitions,
        action,
        fee,
        type,
        status,
      }
    }),
  )

  const transaction_column = createAppColumnHelper<TransactionList>()
  const transaction_table_columns = transaction_column.columns([
    transaction_column.accessor("index", {
      header: "Index",
      cell: (info) => info.getValue(),
    }),
    transaction_column.accessor("transaction_id", {
      header: "Transaction ID",
      cell: (info) => renderSnippet(transaction_id_column, info.getValue()),
    }),
    transaction_column.accessor("transitions", {
      header: "Transitions",
      cell: (info) => info.getValue(),
    }),
    transaction_column.accessor("type", {
      header: "Type",
      cell: (info) => info.getValue(),
    }),
    transaction_column.accessor("action", {
      header: "Action",
      cell: (info) => renderSnippet(action_column, info.getValue()),
    }),
    transaction_column.accessor("fee", {
      header: "Fee",
      cell: (info) =>
        renderComponent(Fee, {
          total_base_fee: info.getValue().base,
          total_priority_fee: info.getValue().priority,
          total_burnt_fee: info.getValue().burnt,
          total_split_fee: info.getValue().split,
        }),
    }),
    transaction_column.accessor("status", {
      header: "Status",
      cell: (info) => renderSnippet(status_column, info.getValue()),
    }),
  ])

  type SolutionList = {
    solution_id: string
    address: string
    counter: Decimal
    target: Decimal
    reward: Decimal
  }

  let solution_table_data: SolutionList[] = $derived(
    block.solutions.map((solution: any) => {
      return {
        solution_id: solution.solution_id,
        address: solution.address,
        counter: new Decimal(solution.counter),
        target: new Decimal(solution.target),
        reward: new Decimal(solution.reward),
      }
    }),
  )

  const solution_column = createAppColumnHelper<SolutionList>()
  const solution_table_columns = solution_column.columns([
    solution_column.accessor("solution_id", {
      header: "Solution ID",
      cell: (info) => renderSnippet(solution_id_column, info.getValue()),
    }),
    solution_column.accessor("address", {
      header: "Address",
      cell: (info) => renderSnippet(address_column, info.getValue()),
    }),
    solution_column.accessor("counter", {
      header: "Counter",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    solution_column.accessor("target", {
      header: "Target",
      cell: (info) => renderSnippet(target_column, info.getValue()),
    }),
    solution_column.accessor("reward", {
      header: "Reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
  ])

  type AbortedSolutionList = {
    solution_id: string
  }

  let aborted_solution_table_data: AbortedSolutionList[] = $derived(
    block.block.aborted_solution_ids.map((solution_id: string) => {
      return {
        solution_id: solution_id,
      }
    }),
  )

  const aborted_solution_column = createAppColumnHelper<AbortedSolutionList>()
  const aborted_solution_table_columns = aborted_solution_column.columns([
    aborted_solution_column.accessor("solution_id", {
      header: "Solution ID",
      cell: (info) => renderSnippet(solution_id_column, info.getValue()),
    }),
  ])

  function action_program_url(action: TransactionList["action"]) {
    return action.edition === null
      ? program_url(action.program, null, {
        height,
        transaction_index: action.transaction_index,
      })
      : program_url(action.program, action.edition)
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

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

  .tab {
    margin-top: 2rem;
  }

  .ellipsis {
    max-width: 30vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .aborted-header {
    margin-top: 1rem;
    font-size: 1rem;
    font-family: "Montserrat Variable", sans-serif;
    font-weight: 600;
    line-height: 1.25rem;
  }
</style>

<Seo
  title="{height} Aleo Block | AleoScan - Aleo Blockchain Explorer"
  description="View Aleo block {height} details. Check transactions, validator, block hash and confirmations."
/>

{#snippet transaction_id_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/transaction/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet solution_id_column(value: string)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet address_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/address/{value}" content={value}>
      <UIAddress address={value} name_data={block.resolved_addresses} />
    </Link>
  </div>
{/snippet}

{#snippet target_column(value: Decimal)}
  <Number number={value} />
  <span class="dim">
    / <Number number={total_target} />
  </span>
{/snippet}

{#snippet action_column(value: TransactionList["action"])}
  {#if value.function === undefined}
    <Link href={action_program_url(value)}>
      <span class="mono">{value.program}</span>
    </Link>
  {:else}
    <div class="column">
      <span class="mono">{value.function}</span>
      <Link secondary href={action_program_url(value)}>
        <span class="secondary mono">{value.program}</span>
      </Link>
    </div>
  {/if}
{/snippet}

{#snippet status_column(value: string)}
  {#if value === "accepted"}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {/if}
{/snippet}

<PageHeader content={height} icon="block-icon" is_number title="Block" />

<div class="details">
  <div class="group">
    <DetailLine label="Height" tooltip="The index of the block in the chain.">
      <Number number={block.block.header.metadata.height} />
    </DetailLine>
    <DetailLine label="Block hash" tooltip="A cryptographic identifier for this block.">
      <span class="mono">{block.block.block_hash}</span>
    </DetailLine>
    <DetailLine label="Timestamp" tooltip="The block timestamp from the consensus algorithm.">
      <Time relative timestamp={block.block.header.metadata.timestamp} />
      <!-- @formatter:off -->
      (<Time no_relative timestamp={block.block.header.metadata.timestamp} />)
      <!-- @formatter:on -->
    </DetailLine>
    <DetailLine label="Epoch" tooltip="The zero-based 360-block puzzle epoch containing this block.">
      <div class="column">
        <span>{Math.floor(block.block.header.metadata.height / 360)}</span>
        <span class="secondary">{block.block.header.metadata.height % 360} / 360</span>
      </div>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine
      label="Validators"
      tooltip="The committee at this block. Red entries were absent from its quorum subdag."
    >
      {block.all_validators.length}
      <a id="validator-toggle" onclick={toggle_validators} onkeydown={toggle_validators} role="button" tabindex="0"
        >(Show validators)</a
      >
      {#if validator_showing}
        <div id="validator-list">
          {#each block.all_validators as validator}
            <Chip
              color={block.validators.indexOf(validator) === -1 ? "var(--red-500)" : undefined}
              link="/address/{validator}"
            >
              <UIAddress address={validator} name_data={block.resolved_addresses} short_address={true} />
            </Chip>
          {/each}
        </div>
      {/if}
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Proof target" tooltip="The solution proof target calculated for the next block.">
      <Number number={block.block.header.metadata.proof_target}></Number>
    </DetailLine>
    <DetailLine label="Coinbase target" tooltip="The puzzle reward target calculated for the next block.">
      <Number number={block.block.header.metadata.coinbase_target}></Number>
    </DetailLine>
    <DetailLine
      label="Cumulative proof target"
      tooltip="Accepted solution target accumulated during the current reward cycle."
    >
      <div class="column">
        <Number number={block.block.header.metadata.cumulative_proof_target}></Number>
        <!-- @formatter:off -->
        <span class="secondary"
          ><Number
            number={(block.block.header.metadata.cumulative_proof_target /
              block.block.header.metadata.coinbase_target) *
              100}
            precision={2}
          ></Number>% coinbase target reached</span
        >
        <!-- @formatter:on -->
      </div>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine
      label="Block reward"
      tooltip="Issuance, one-third of coinbase rewards, and priority fees distributed to stakers."
    >
      <AleoCredit number={rewards.block} suffix={true}></AleoCredit>
    </DetailLine>
    <DetailLine label="Puzzle reward" tooltip="Two-thirds of the coinbase reward, split by accepted solution target.">
      <AleoCredit number={rewards.puzzle} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Total fee" tooltip="The total fees spent by confirmed transactions in this block.">
      <div class="column">
        <AleoCredit
          number={total_fee.base.add(total_fee.priority).add(total_fee.burnt).add(total_fee.split)}
          suffix={true}
        ></AleoCredit>
        <span class="secondary">
          <Fee
            total_base_fee={total_fee.base}
            total_burnt_fee={total_fee.burnt}
            total_priority_fee={total_fee.priority}
            total_split_fee={total_fee.split}
          />
        </span>
      </div>
    </DetailLine>
  </div>
</div>

{#snippet transactions()}
  <div class="tab">
    {#if block.block.transactions.length === 0 && block.block.aborted_transaction_ids.length === 0}
      <Callout title="No transactions" description="This block has no transactions." icon="list-icon" />
    {:else}
      {#if block.block.transactions.length > 0}
        <TableContainer>
          <DataTable columns={transaction_table_columns} data={transaction_table_data} />
        </TableContainer>
      {/if}
      {#if block.block.aborted_transaction_ids.length > 0}
        <div class="aborted-header">Aborted transactions</div>
      {/if}
    {/if}
  </div>
{/snippet}
{#snippet block_info()}
  <div class="tab">
    <div class="details">
      <div class="group">
        <DetailLine label="Round" tooltip="The iteration used for consensus and block production.">
          <Number number={block.block.header.metadata.round} />
        </DetailLine>
        <DetailLine
          label="Cumulative weight"
          tooltip="The cumulative target of accepted puzzle solutions through this block."
        >
          <Number number={block.block.header.metadata.cumulative_weight} />
        </DetailLine>
      </div>
      <div class="group">
        <div class="details-line"></div>
      </div>
      <div class="group">
        <DetailLine label="Previous block hash" tooltip="The hash of the block immediately before this one.">
          <span class="mono">{block.block.previous_hash}</span>
        </DetailLine>
        <DetailLine
          label="Previous state root"
          tooltip="The state root representing the global state before this block."
        >
          <span class="mono">{block.block.header.previous_state_root}</span>
        </DetailLine>
      </div>
      <div class="group">
        <div class="details-line"></div>
      </div>
      <div class="group">
        <DetailLine label="Transactions root" tooltip="The Merkle root of the confirmed transaction IDs in this block.">
          <span class="mono">{block.block.header.transactions_root}</span>
        </DetailLine>
        <DetailLine
          label="Finalize root"
          tooltip="Commitment to transaction finalize IDs and ratified finalize operations."
        >
          <span class="mono">{block.block.header.finalize_root}</span>
        </DetailLine>
        <DetailLine label="Ratifications root" tooltip="The Merkle root of the ratification IDs in this block.">
          <span class="mono">{block.block.header.ratifications_root}</span>
        </DetailLine>
        <DetailLine label="Solutions root" tooltip="Accumulator commitment to included solutions, or zero when empty.">
          <span class="mono">{block.block.header.solutions_root}</span>
        </DetailLine>
      </div>
    </div>
  </div>
{/snippet}
{#snippet solutions()}
  <div class="tab">
    {#if block.solutions.length === 0 && block.block.aborted_solution_ids.length === 0}
      <Callout title="No solutions" description="This block has no puzzle solutions." icon="list-icon" />
    {:else}
      {#if block.solutions.length > 0}
        <TableContainer>
          <DataTable columns={solution_table_columns} data={solution_table_data} />
        </TableContainer>
      {/if}
      {#if block.block.aborted_solution_ids.length > 0}
        <div class="aborted-header">Aborted solutions</div>
        <TableContainer>
          <DataTable columns={aborted_solution_table_columns} data={aborted_solution_table_data} />
        </TableContainer>
      {/if}
    {/if}
  </div>
{/snippet}
<Tabs
  tabs={[
    { title: "Transactions", id: "transactions", content: transactions },
    { title: "Block info", id: "block_info", content: block_info },
    { title: "Puzzle solutions", id: "solutions", content: solutions },
  ]}
/>

<PageInformation
  title="Block"
  description="A block in the Aleo blockchain is a fundamental unit that records transactions and state transitions. It is cryptographically secured and linked to the previous block, forming a chain. Each block contains data that is validated by the network’s consensus mechanism."
  icon="block-icon"
/>
