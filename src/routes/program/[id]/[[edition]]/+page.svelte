<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { ButtonLinkClass, StatusClass } from "$lib/types"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import { type PaginationState, renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import { Highlight } from "svelte-rune-highlight"
  import aleo from "$lib/hljs.aleo.js"
  import { createAppColumnHelper } from "$lib/table"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"
  import UIAddress from "$lib/components/UIAddress.svelte"
  import TableNav from "$lib/components/TableNav.svelte"
  import Button from "$lib/components/Button.svelte"
  import ReadMapping from "$lib/components/ReadMapping.svelte"
  import Callout from "$lib/components/Callout.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import TableContainer from "$lib/components/TableContainer.svelte"
  import { tooltips } from "$lib/tooltips"
  import { goto } from "$app/navigation"
  import { program_url } from "$lib/utils"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  type TransitionList = {
    height: number
    timestamp: number
    transition_id: string
    function_name: string
    type: string
  }

  let transition_table_data: TransitionList[] = $derived(data.recent_calls)

  const transition_column = createAppColumnHelper<TransitionList>()
  const transition_table_columns = transition_column.columns([
    transition_column.accessor("height", {
      header: "Height",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    transition_column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    }),
    transition_column.accessor("transition_id", {
      header: "Transition ID",
      cell: (info) => renderSnippet(transition_id_column, info.getValue()),
    }),
    transition_column.accessor("function_name", {
      header: "Function called",
      cell: (info) => renderSnippet(function_column, info.getValue()),
    }),
    transition_column.accessor("type", {
      header: "Status",
      cell: (info) => renderSnippet(status_column, info.getValue()),
    }),
  ])

  let pagination: PaginationState = $state({
    pageIndex: 0,
    pageSize: 10,
  })

  function set_page(page: number) {
    pagination = { ...pagination, pageIndex: page - 1 }
  }

  let total_pages = $derived(Math.ceil(data.recent_calls.length / pagination.pageSize))
  let paginated_transition_data = $derived(
    transition_table_data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    ),
  )

  function select_edition(event: Event) {
    goto(program_url(data.program_id, (event.currentTarget as HTMLSelectElement).value))
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
  }

  .details-line {
    width: 100%;
    height: 1px;
    background-color: $grey-100;
  }

  .tab {
    margin-top: 2rem;
  }

  .ellipsis {
    max-width: 30vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tab {
    line-height: 1.25rem;
  }

  .source-code {
    display: flex;
    padding: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem;
    border: 1px solid $grey-100;
    background: $grey-25;
  }

  .source-code-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    align-self: stretch;
    font-weight: 600;

    > span {
      flex: 1 0 0;
    }
  }

  .mappings {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 40rem;
  }

  .edition-select {
    padding: 0.375rem 0.625rem;
    border: 1px solid $grey-100;
    border-radius: 0.5rem;
    background: white;
    color: inherit;
    font: inherit;
  }
</style>

<Seo
  title="Aleo Program {data.program_id} | AleoScan - Aleo Blockchain Explorer"
  description="Explore Aleo program {data.program_id}. View contract execution, function calls, and transaction logs."
/>

{#snippet transition_id_column(value: string)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet height_column(value: number)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

{#snippet function_column(value: string)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet status_column(value: string)}
  {#if value.startsWith("Accepted")}
    <Status cls={StatusClass.Success}>Accepted</Status>
  {:else if value.startsWith("Rejected")}
    <Status cls={StatusClass.Danger}>Rejected</Status>
  {:else}
    <Status cls={StatusClass.Warning}>Unknown</Status>
  {/if}
{/snippet}

<PageHeader content={data.program_id} icon="program-icon" title="Program" />

<div class="details">
  <div class="group">
    <DetailLine label="Program ID" tooltip={tooltips.program.programId}>
      <span class="mono">{data.program_id}</span>
    </DetailLine>
    <DetailLine label="Edition">
      <select aria-label="Program edition" class="edition-select" onchange={select_edition} value={data.edition}>
        {#each data.editions as edition}
          <option value={edition}>{edition}{edition === data.latest_edition ? " (latest)" : ""}</option>
        {/each}
      </select>
    </DetailLine>
    <DetailLine label="Program address" tooltip={tooltips.program.programAddress}>
      <Link href="/address/{data.address}">
        <UIAddress address={data.address} name_data={{}} />
      </Link>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  {#if data.transaction_id !== null}
    <div class="group">
      <DetailLine label="Deployment transaction" tooltip={tooltips.program.deploymentTransaction}>
        <Link href="/transaction/{data.transaction_id}">
          <span class="mono">{data.transaction_id}</span>
        </Link>
      </DetailLine>
      <DetailLine label="Program owner" tooltip={tooltips.program.programOwner}>
        <Link href="/address/{data.owner}">
          <UIAddress address={data.owner} name_data={data.resolved_addresses} />
        </Link>
      </DetailLine>
    </div>
    <div class="group">
      <div class="details-line"></div>
    </div>
  {/if}
  <div class="group">
    <DetailLine label="Times called" tooltip={tooltips.program.timesCalled}>
      <Number number={data.times_called} />
    </DetailLine>
    <DetailLine label="Similar programs" tooltip={tooltips.program.similarPrograms}>
      {#if data.similar_count === 0}
        0
      {:else}
        <Link href="/similar_programs/{data.program_id}/{data.edition}">
          <Number number={data.similar_count} />
        </Link>
      {/if}
    </DetailLine>
  </div>
</div>

{#snippet structure()}
  <div class="tab">
    <div class="details">
      <div class="group">
        <DetailLine label="Imports">
          {#if data.imports.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.imports as imported}
              <Link href={program_url(imported.program_id, imported.edition)}>
                <div class="mono">{imported.program_id}</div>
              </Link>
            {/each}
          {/if}
        </DetailLine>
        <div class="details-line"></div>
        <DetailLine label="Mappings">
          {#if data.mappings.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.mappings as m}
              <div class="mono">{m.name} ({m.key_type} -> {m.value_type})</div>
            {/each}
          {/if}
        </DetailLine>
        <div class="details-line"></div>
        <DetailLine label="Structs">
          {#if data.structs.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.structs as s}
              <div class="mono">{s}</div>
            {/each}
          {/if}
        </DetailLine>
        <div class="details-line"></div>
        <DetailLine label="Records">
          {#if data.records.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.records as r}
              <div class="mono">{r}</div>
            {/each}
          {/if}
        </DetailLine>
        <div class="details-line"></div>
        <DetailLine label="Functions">
          {#if data.closures.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.closures as f}
              <div class="mono">{f}</div>
            {/each}
          {/if}
        </DetailLine>
        <div class="details-line"></div>
        <DetailLine label="Transitions">
          {#if data.functions.length === 0}
            <span class="dim">None</span>
          {:else}
            {#each data.functions as t}
              <div class="mono">{t}</div>
            {/each}
          {/if}
        </DetailLine>
      </div>
    </div>
  </div>
{/snippet}
{#snippet recent_calls()}
  <div class="tab">
    {#if transition_table_data.length === 0}
      <Callout title="No transitions" description="There are no transitions in this program yet." icon="list-icon" />
    {:else}
      <TableContainer>
        {#key pagination}
          <DataTable columns={transition_table_columns} data={paginated_transition_data} />
        {/key}
        {#key pagination}
          <TableNav page={pagination.pageIndex + 1} {set_page} {total_pages} />
        {/key}
      </TableContainer>
    {/if}
  </div>
{/snippet}
{#snippet source_code()}
  <div class="tab">
    <div class="source-code">
      <div class="source-code-header">
        <span>Program Source Code (Aleo Instruction)</span>
        <Button cls={ButtonLinkClass.Ghost} disabled label="Upload Leo Source" />
      </div>
      <div class="details-line"></div>
      <div class="source-code-body">
        <Highlight
          language={aleo}
          code={data.source}
          numberLine
          hideBorder
          backgroudColor="#f9f9f9"
          --line-number-color="#9e9e9e"
        />
      </div>
    </div>
  </div>
{/snippet}
{#snippet read_mappings()}
  <div class="tab">
    {#if data.mappings.length === 0}
      <Callout title="No mappings" description="This program has no mappings." icon="list-icon" />
    {:else}
      <div class="mappings">
        {#key data.mappings}
          {#each data.mappings as mapping}
            <ReadMapping
              program={data.program_id}
              mapping={mapping.name}
              type={mapping.key_type + " -> " + mapping.value_type}
            />
          {/each}
        {/key}
      </div>
    {/if}
  </div>
{/snippet}
<Tabs
  tabs={[
    { title: "Program structure", id: "structure", content: structure },
    { title: "Recent transitions", id: "recent_calls", content: recent_calls },
    { title: "Source code", id: "source_code", content: source_code },
    { title: "Read mappings", id: "read_mappings", content: read_mappings },
  ]}
/>

<PageInformation
  title="Program"
  description="A program on the Aleo blockchain is a smart contract that allows users to interact with private computations. These programs leverage zero-knowledge cryptography to ensure that the details of transactions and operations remain private. Programs can be deployed and called by any participant on the network."
  icon="program-icon"
/>
