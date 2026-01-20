<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { ButtonLinkClass, StatusClass } from "$lib/types"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import {
    type ColumnDef,
    type PaginationState,
    renderComponent,
  } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import { Highlight } from "svelte-rune-highlight"
  import aleo from "$lib/hljs.aleo.js"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"
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

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  $inspect(data)

  const tab_data = [
    { title: "Program structure", id: "structure" },
    { title: "Recent transitions", id: "recent_calls" },
    { title: "Source code", id: "source_code" },
    { title: "Read mappings", id: "read_mappings" },
  ]

  type TransitionList = {
    height: number
    timestamp: number
    transaction_id: string
    function_name: string
    type: string
  }

  let transition_table_data: TransitionList[] = $derived(data.recent_calls)

  const transition_table_columns: ColumnDef<TransitionList, any>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: height_column, value: info.getValue() }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    },
    {
      accessorKey: "transition_id",
      header: "Transition ID",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: transition_id_column, value: info.getValue() }),
    },
    {
      accessorKey: "function_name",
      header: "Function called",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: function_column, value: info.getValue() }),
    },
    {
      accessorKey: "type",
      header: "Status",
      cell: (info) => renderComponent(SnippetWrapper, { snippet: status_column, value: info.getValue() }),
    },
  ]

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
      (pagination.pageIndex + 1) * pagination.pageSize
    )
  )
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
    display: none;
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

  .tab {
    line-height: 1.25rem;
    display: none;
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
</style>

<Seo
  title="Aleo Program {data.program_id} | AleoScan - Aleo Blockchain Explorer"
  description="Explore Aleo program {data.program_id}. View contract execution, function calls, and transaction logs."
/>

{#snippet transition_id_column(value)}
  <div class="mono ellipsis">
    <Link href="/transition/{value}" content={value}></Link>
  </div>
{/snippet}

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

{#snippet function_column(value)}
  <div class="mono">{value}</div>
{/snippet}

{#snippet status_column(value)}
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
        <Link href="/similar_programs/{data.program_id}">
          <Number number={data.similar_count} />
        </Link>
      {/if}
    </DetailLine>
  </div>
</div>

<Tabs {tab_data}>
  {#snippet structure(binds)}
    <div class="tab" bind:this={binds.structure}>
      <div class="details">
        <div class="group">
          <DetailLine label="Imports">
            {#if data.imports.length === 0}
              <span class="dim">None</span>
            {:else}
              {#each data.imports as i}
                <Link href="/program/{i}">
                  <div class="mono">{i}</div>
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
  {#snippet recent_calls(binds)}
    <div class="tab" bind:this={binds.recent_calls}>
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
  {#snippet source_code(binds)}
    <div class="tab" bind:this={binds.source_code}>
      <div class="source-code">
        <div class="source-code-header">
          <span>Program Source Code (Aleo Instruction)</span>
          <Button cls={ButtonLinkClass.Ghost} disabled Content="Upload Leo Source" />
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
            class="source-code-highlight"
          />
        </div>
      </div>
    </div>
  {/snippet}
  {#snippet read_mappings(binds)}
    <div class="tab" bind:this={binds.read_mappings}>
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
</Tabs>

<PageInformation
  title="Program"
  description="A program on the Aleo blockchain is a smart contract that allows users to interact with private computations. These programs leverage zero-knowledge cryptography to ensure that the details of transactions and operations remain private. Programs can be deployed and called by any participant on the network."
  icon="program-icon"
/>
