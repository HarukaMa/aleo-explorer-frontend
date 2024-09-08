<script lang="ts">

  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import { format_time, TimeMode } from "$lib/time_mode.svelte.js"
  import AleoCredit from "$lib/components/AleoCredit.svelte"
  import Chip from "$lib/components/Chip.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Decimal from "decimal.js"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import Fee from "$lib/components/Fee.svelte"

  let { data } = $props()
  let { block, height } = data

  console.log(block)

  const ratifications = block.block.ratifications

  let block_reward = new Decimal(0), puzzle_reward = new Decimal(0)

  for (let ratify of ratifications) {
    if (ratify.type === "block_reward") {
      block_reward = new Decimal(ratify.amount)
    } else if (ratify.type === "puzzle_reward") {
      puzzle_reward = new Decimal(ratify.amount)
    }
  }

  let total_base_fee = new Decimal(0), total_priority_fee = new Decimal(0)
  let total_burnt_fee = new Decimal(0)

  for (let tx of block.block.transactions) {
    if (tx.type === "accepted_execute") {
      if (tx.transaction.fee !== null) {
        const fee = tx.transaction.fee
        total_base_fee = total_base_fee.add(fee.amount[0])
        total_priority_fee = total_priority_fee.add(fee.amount[1])
      }
    } else {
      const fee = tx.transaction.fee
      total_base_fee = total_base_fee.add(fee.amount[0])
      total_priority_fee = total_priority_fee.add(fee.amount[1])
    }
  }

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

  const tab_data = [
    { title: "Transactions", id: "transactions" },
    { title: "Block info", id: "block_info" },
    { title: "Puzzle solutions", id: "solutions" },
  ]

  type TransactionList = {
    index: number
    transaction_id: string
    transitions: number
    action: string
    fee: string
    type: string
    status: string
  }

  let transaction_table_data: TransactionList[] = block.block.transactions.map((tx: any, index: number) => {
    let transitions: number, action: string, type: string, status: string
    let fee: Decimal[] | number[]
    if (tx.type === "accepted_execute") {
      transitions = tx.transaction.execution.transitions.length
      if (tx.transaction.fee.transition !== null) {
        transitions += 1
        fee = tx.transaction.fee.amount.map((x: number) => new Decimal(x))
      } else {
        fee = [new Decimal(0), new Decimal(0)]
      }
      const action_transition = tx.transaction.execution.transitions.at(-1)
      action = action_transition.program_id + " " + action_transition.function_name
    } else if (tx.type === "accepted_deploy") {
      transitions = 1
      action = tx.transaction.deployment.program.id
      fee = tx.transaction.fee.amount.map((x: number) => new Decimal(x))
    } else if (tx.type === "rejected_execute") {
      transitions = 1
      const action_transition = tx.transaction.rejected.execution.transitions.at(-1)
      action = action_transition.program_id + " " + action_transition.function_name
      fee = tx.transaction.fee.amount.map((x: number) => new Decimal(x))
    } else if (tx.type === "rejected_deploy") {
      transitions = 1
      action = tx.transaction.rejected.deployment.program.id
      fee = tx.transaction.fee.amount.map((x: number) => new Decimal(x))
    } else {
      transitions = 0
      action = "Unknown"
      fee = [new Decimal(0), new Decimal(0)]
    }
    [status, type] = tx.type.split("_")
    type = type.charAt(0).toUpperCase() + type.slice(1)
    return {
      index: index,
      transaction_id: tx.transaction.id,
      transitions: transitions,
      action: action,
      fee: fee,
      type: type,
      status: status,
    }
  })

  const columns: ColumnDef<TransactionList, any>[] = [
    {
      accessorKey: "index",
      header: "Index",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "transaction_id",
      header: "Transaction ID",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "transitions",
      header: "Transitions",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: info => renderComponent(Fee, {
        total_base_fee: info.getValue()[0],
        total_priority_fee: info.getValue()[1],
        total_burnt_fee: new Decimal(0),
      }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: info => info.getValue(),
    },
  ]

  const table = createTable<TransactionList>({
    data: transaction_table_data,
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

    .block-icon {
      height: 32px;
      width: 32px;
      background-image: $block-icon;
    }

    .block-num {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .block-title {
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
    margin-top: 2rem;
    width: 100%;
  }

</style>

{#snippet before_container()}
  <div class="header">
    <div class="flex">
      <div class="block-icon"></div>
      <div class="vert">
        <div class="block-title">Block</div>
        <div class="block-num">
          <Number number={height} />
        </div>
      </div>
    </div>
  </div>
{/snippet}

<div class="details">
  <div class="group">
    <DetailLine label="Height">
      <Number number={block.block.header.metadata.height} />
    </DetailLine>
    <DetailLine label="Block hash">
      <span class="mono">{block.block.block_hash}</span>
    </DetailLine>
    <DetailLine label="Timestamp">
      { format_time(new Date(block.block.header.metadata.timestamp * 1000), TimeMode.Relative) }
      <!-- @formatter:off -->
      (<Time timestamp={block.block.header.metadata.timestamp} />)
      <!-- @formatter:on -->
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Validators">
      {block.all_validators.length} <a id="validator-toggle" onclick={toggle_validators}>(Show validators)</a>
      {#if validator_showing}
        <div id="validator-list">
          {#each block.all_validators as validator}
            <Chip color={block.validators.indexOf(validator) === -1 ? "var(--red-500)" : undefined}
                  link="/address/{validator}">
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
    <DetailLine label="Proof target">
      <Number number={block.block.header.metadata.proof_target}></Number>
    </DetailLine>
    <DetailLine label="Coinbase target">
      <Number number={block.block.header.metadata.coinbase_target}></Number>
    </DetailLine>
    <DetailLine label="Cumulative proof target">
      <div class="column">
        <Number number={block.block.header.metadata.cumulative_proof_target}></Number>
        <!-- @formatter:off -->
        <span class="secondary"><Number number={block.block.header.metadata.cumulative_proof_target / block.block.header.metadata.coinbase_target * 100} precision={2}></Number>% coinbase target reached</span>
        <!-- @formatter:on -->
      </div>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Block reward">
      <AleoCredit number={block_reward} suffix={true}></AleoCredit>
    </DetailLine>
    <DetailLine label="Puzzle reward">
      <AleoCredit number={puzzle_reward} suffix={true}></AleoCredit>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Total fee">
      <div class="column">
        <AleoCredit number={total_base_fee.add(total_priority_fee)} suffix={true}></AleoCredit>
        <span class="secondary">
          <Fee {total_base_fee} {total_burnt_fee} {total_priority_fee} />
        </span>
      </div>
    </DetailLine>
  </div>
</div>


<Tabs {tab_data}>
  {#snippet transactions(binds)}
    <div bind:this={binds.transactions}>
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
  {/snippet}
  {#snippet block_info(binds)}
    <div bind:this={binds.block_info}>B</div>
  {/snippet}
  {#snippet solutions(binds)}
    <div bind:this={binds.solutions}>C</div>
  {/snippet}
</Tabs>