<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Decimal from "decimal.js"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import { createAppColumnHelper } from "$lib/table"
  import Link from "$lib/components/Link.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import Time from "$lib/components/Time.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import { tooltips } from "$lib/tooltips"
  import { program_url } from "$lib/utils"

  let { data: server_data } = $props()
  let { data, address } = $derived(server_data)

  let resolved = $derived(data.resolved_addresses[address])

  let bonded_to = $derived(data.resolved_addresses[data.bond_state?.validator])

  type TransitionList = {
    height: number
    timestamp: number
    transition_id: string
    action: {
      program: string
      function: string
      edition: number
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
          edition: ts.program_edition,
        },
      }
    }),
  )

  const transition_column = createAppColumnHelper<TransitionList>()
  const transition_table_columns = transition_column.columns([
    transition_column.accessor("height", {
      header: "In block",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    transition_column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderSnippet(timestamp_column, info.getValue()),
    }),
    transition_column.accessor("transition_id", {
      header: "Transition ID",
      cell: (info) => renderSnippet(transition_id_column, info.getValue()),
    }),
    transition_column.accessor("action", {
      header: "Function / Program",
      cell: (info) => renderSnippet(action_column, info.getValue()),
    }),
  ])

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

  const solution_column = createAppColumnHelper<SolutionList>()
  const solution_table_columns = solution_column.columns([
    solution_column.accessor("height", {
      header: "In block",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    solution_column.accessor("epoch", {
      header: "Epoch",
      cell: (info) => renderComponent(Number, { number: info.getValue() }),
    }),
    solution_column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderSnippet(timestamp_column, info.getValue()),
    }),
    solution_column.accessor("solution_id", {
      header: "Solution ID",
      cell: (info) => renderSnippet(solution_id_column, info.getValue()),
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

  type ProgramList = {
    height: number
    program: string
    edition: number
    timestamp: number
    transaction_id: string
  }

  let program_table_data: ProgramList[] = $derived(
    data.programs.map((program: any) => {
      return {
        height: program.height,
        program: program.program_id,
        edition: program.edition,
        timestamp: program.timestamp,
        transaction_id: program.transaction_id,
      }
    }),
  )

  const program_column = createAppColumnHelper<ProgramList>()
  const program_table_columns = program_column.columns([
    program_column.accessor("height", {
      header: "In block",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    program_column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderSnippet(timestamp_column, info.getValue()),
    }),
    program_column.accessor("transaction_id", {
      header: "Transaction ID",
      cell: (info) => renderSnippet(transaction_id_column, info.getValue()),
    }),
    program_column.accessor("program", {
      header: "Program ID",
      cell: (info) => renderSnippet(program_id_column, info.row.original),
    }),
  ])

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

  const delegator_column = createAppColumnHelper<DelegatorList>()
  const delegator_table_columns = delegator_column.columns([
    delegator_column.accessor("address", {
      header: "Address",
      cell: (info) => renderSnippet(address_column, info.getValue()),
    }),
    delegator_column.accessor("amount", {
      header: "Staked",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
  ])
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .address-icon {
    height: 40px;
    width: 40px;
    background-image: url("$lib/assets/images/icons/address-icon.svg");
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

  .tab {
    margin-top: 2rem;
  }

  .ellipsis {
    max-width: 30vw;
    overflow: hidden;
    text-overflow: ellipsis;
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

<Seo
  title="Aleo Address {address} | AleoScan - Aleo Blockchain Explorer"
  description="Check Aleo address {address} details. View public transaction history, and public balance."
/>

{#snippet address_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/address/{value}">
      <UIAddress address={value} name_data={data.resolved_addresses} />
    </Link>
  </div>
{/snippet}

{#snippet height_column(value: number)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

{#snippet timestamp_column(value: number)}
  <Time timestamp={value} />
{/snippet}

{#snippet action_column(value: { program: string; function: string; edition: number })}
  <div class="column">
    <span class="mono">{value.function}</span>
    <Link href={program_url(value.program, value.edition)}>
      <span class="secondary mono">{value.program}</span>
    </Link>
  </div>
{/snippet}

{#snippet transition_id_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet solution_id_column(value: string)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet target_column(value: { proof: Decimal; sum: Decimal })}
  <Number number={value.proof} />
  <span class="dim">
    / <Number number={value.sum} />
  </span>
{/snippet}

{#snippet transaction_id_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/transaction/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet program_id_column(value: ProgramList)}
  <div class="mono">
    <Link href={program_url(value.program, value.edition)} content={value.program}></Link>
  </div>
{/snippet}

<PageHeader>
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
      <UIAddress {address} keep_font name_data={data.resolved_addresses} short_address />
    </div>
  </div>
</PageHeader>

<div class="details">
  {#if data.program_name}
    <div class="address-warning">
      <div class="address-alert-icon"></div>
      This is a program address. Records owned by programs are currently not spendable.
    </div>
  {/if}
  <div class="group">
    <DetailLine label="Address" tooltip={tooltips.address.address}>
      <span class="mono">{data.address}</span>
    </DetailLine>
    {#if data.program_name}
      <DetailLine label="Program name" tooltip={tooltips.address.programName}>
        <Link href="/program/{data.program_name}">
          <span class="mono">{data.program_name}</span>
        </Link>
      </DetailLine>
    {/if}
    {#if resolved.name}
      <DetailLine label="Primary ANS name" tooltip={tooltips.address.publicAnsNames}>
        {resolved.name}
      </DetailLine>
    {/if}
    {#if resolved.tag}
      <DetailLine label="Address tag" tooltip={tooltips.address.addressTag}>
        {resolved.tag}
      </DetailLine>
    {/if}
    {#if resolved.link}
      <DetailLine label="Website" tooltip={tooltips.address.website}>
        <Link href={resolved.link} content={resolved.link} external />
      </DetailLine>
    {/if}
    <DetailLine label="Public credits" tooltip={tooltips.address.publicBalance}>
      <AleoCredit number={data.public_balance} suffix />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    {#if data.bond_state}
      <DetailLine label="Credits staked" tooltip={tooltips.address.tokensStaked}>
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
        <DetailLine label="Bonded to validator" tooltip={tooltips.address.stakedToValidator}>
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
      <DetailLine label="Withdrawal address" tooltip={tooltips.address.withdrawalAddress}>
        {#if data.withdrawal_address === address}
          Self
        {:else}
          <Link href="/address/{data.withdrawal_address}">
            <UIAddress address={data.withdrawal_address} name_data={data.resolved_addresses} />
          </Link>
        {/if}
      </DetailLine>
    {/if}
    <DetailLine label="Lifetime stake reward" tooltip={tooltips.address.lifetimeStakeReward}>
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
    <DetailLine label="Public credits received" tooltip={tooltips.address.publicTokensReceived}>
      <AleoCredit number={data.transfer_in} suffix />
    </DetailLine>
    <DetailLine label="Public credits sent" tooltip={tooltips.address.publicTokensSent}>
      <AleoCredit number={data.transfer_out} suffix />
    </DetailLine>
    <DetailLine label="Total fee spent" tooltip={tooltips.address.totalFeeSpent}>
      <AleoCredit number={data.fee} suffix />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  {#if data.committee_state}
    <div class="group">
      <DetailLine label="Credits staked" tooltip={tooltips.validator.tokensStakedToValidator}>
        <AleoCredit number={data.delegated} suffix />
      </DetailLine>
      <DetailLine label="Open for staking" tooltip={tooltips.validator.openForStaking}>
        {#if data.committee_state.is_open}
          Yes
        {:else}
          No
        {/if}
      </DetailLine>
      <DetailLine label="Commission" tooltip={tooltips.validator.commission}>
        {data.committee_state.commission}%
      </DetailLine>
      <DetailLine label="Uptime in last 24 hours" tooltip={tooltips.validator.uptime}>
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
    <DetailLine label="Programs deployed" tooltip={tooltips.address.programsDeployed}>
      <Number number={data.total_programs} />
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Accepted puzzle solutions" tooltip={tooltips.address.acceptedPuzzleSolutions}>
      <Number number={data.total_solutions} />
    </DetailLine>
    <DetailLine label="Lifetime puzzle reward" tooltip={tooltips.address.lifetimePuzzleReward}>
      <AleoCredit number={data.total_rewards} suffix />
    </DetailLine>
  </div>
</div>

{#snippet delegators()}
  <div class="tab">
    <TableContainer>
      <DataTable columns={delegator_table_columns} data={delegator_table_data}>
        {#snippet emptyState()}
          <Callout
            title="No delegators"
            description="This address has not staked any credits to other addresses."
            icon="list-icon"
          />
        {/snippet}
      </DataTable>
    </TableContainer>
  </div>
{/snippet}
{#snippet transitions()}
  <div class="tab">
    <TableContainer>
      <DataTable columns={transition_table_columns} data={transition_table_data}>
        {#snippet emptyState()}
          <Callout
            title="No transitions"
            description="This address has not publicly appeared in any transition."
            icon="list-icon"
          />
        {/snippet}
      </DataTable>
    </TableContainer>
  </div>
{/snippet}
{#snippet solutions()}
  <div class="tab">
    <TableContainer>
      <DataTable columns={solution_table_columns} data={solution_table_data}>
        {#snippet emptyState()}
          <Callout
            title="No solutions"
            description="This address has not submitted any valid puzzle solutions."
            icon="list-icon"
          />
        {/snippet}
      </DataTable>
    </TableContainer>
  </div>
{/snippet}
{#snippet programs()}
  <div class="tab">
    <TableContainer>
      <DataTable columns={program_table_columns} data={program_table_data}>
        {#snippet emptyState()}
          <Callout title="No programs" description="This address has not deployed any programs." icon="list-icon" />
        {/snippet}
      </DataTable>
    </TableContainer>
  </div>
{/snippet}
<Tabs
  tabs={[
    ...(data.delegated > 0 ? [{ title: "Top delegators", id: "delegators", content: delegators }] : []),
    { title: "Recent transitions", id: "transitions", content: transitions },
    { title: "Accepted solutions", id: "solutions", content: solutions },
    { title: "Deployed programs", id: "programs", content: programs },
  ]}
/>

<PageInformation
  title="Address"
  description="An address in the Aleo blockchain serves as a unique identifier for users or entities. It is used to send and receive credits, interact with programs, and store transaction history. Addresses are essential for identifying participants on the network."
  icon="address-icon"
/>
