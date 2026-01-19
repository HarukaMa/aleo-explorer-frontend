<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import { StatusClass } from "$lib/types"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Tabs from "$lib/components/Tabs.svelte"
  import Link from "$lib/components/Link.svelte"
  import Status from "$lib/components/Status.svelte"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"

  let { data: server_data } = $props()
  let { data } = $derived(server_data)

  $inspect(data)

  let transition = $derived(data.transition)

  let tab_data = $derived.by(() => {
    let tabs = [
      { title: "Inputs", id: "input" },
      { title: "Outputs", id: "output" },
    ]
    if (transition.outputs.length > 0 && transition.outputs.at(-1).type === "future") {
      tabs.push({ title: "Finalize inputs", id: "finalize" })
    }
    return tabs
  })

  let tabs: Tabs
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  div.header {
    .transition-icon {
      height: 32px;
      width: 32px;
      background-image: $transition-icon;
    }

    .transition-id {
      font-size: 1.375rem;
      font-weight: 600;
      font-family: "Montserrat Variable", sans-serif;
    }

    .transition-title {
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
    word-break: break-all;

    &.compact {
      margin-top: 1rem;
    }

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

  .tab {
    margin-top: 2rem;
    display: none;
  }

  .header-xs {
    font-size: 1rem;
    font-family: "Montserrat Variable", sans-serif;
    font-weight: 600;
    line-height: 1.25rem;
    margin-top: 1rem;
  }

  .record-field {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    align-self: stretch;
    word-break: break-all;
  }

  button.link {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: $blue-600;
    font-family: inherit;
    font-size: inherit;

    :hover {
      text-decoration: underline;
    }
  }
</style>

<Seo
  title="Aleo Transition {transition.id} | AleoScan - Aleo Blockchain Explorer"
  description="View Aleo transition {transition.id}. Check execution inputs, outputs, transaction hash, and smart contract calls."
/>

{#snippet before_container()}
  <div class="header">
    <div class="flex">
      <div class="transition-icon"></div>
      <div class="vert">
        <div class="transition-title">Transition</div>
        <div class="transition-id"></div>
      </div>
    </div>
  </div>
{/snippet}

<PageHeader
  content={transition.id.slice(0, 11) + "..." + transition.id.slice(-6)}
  icon="transition-icon"
  title="Transition"
/>

<div class="details">
  <div class="group">
    <DetailLine label="Transition ID">
      <span class="mono">{transition.id}</span>
    </DetailLine>
    <DetailLine label="Transaction">
      <Link href="/transaction/{data.transaction_id}">
        <span class="mono">{data.transaction_id}</span>
      </Link>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Status">
      {#if data.is_aborted}
        <Status cls={StatusClass.Danger}>Aborted</Status>
      {:else if !data.is_confirmed}
        <Status cls={StatusClass.Info}>Unconfirmed</Status>
      {:else if data.is_accepted}
        <Status cls={StatusClass.Success}>Accepted</Status>
      {:else}
        <Status cls={StatusClass.Danger}>Rejected</Status>
      {/if}
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Program ID">
      <Link href="/program/{transition.program_id}">
        <span class="mono">{transition.program_id}</span>
      </Link>
    </DetailLine>
    <DetailLine label="Function name">
      <span class="mono">{transition.function_name}</span>
    </DetailLine>
  </div>
  <div class="group">
    <div class="details-line"></div>
  </div>
  <div class="group">
    <DetailLine label="Transition public key">
      <span class="mono">{transition.tpk}</span>
    </DetailLine>
    <DetailLine label="Transition commitment">
      <span class="mono">{transition.tcm}</span>
    </DetailLine>
    <DetailLine label="Signer commitment">
      <span class="mono">{transition.scm}</span>
    </DetailLine>
  </div>
</div>

<Tabs bind:this={tabs} {tab_data}>
  {#snippet input(binds)}
    <div class="tab" bind:this={binds.input}>
      {#each transition.inputs as input, i}
        <div class="header-xs">Input #{i + 1}</div>
        <div class="details compact">
          <div class="group">
            <DetailLine label="Type">
              {input.type.charAt(0).toUpperCase() + input.type.slice(1).replace("_", " ")}
              <span class="mono">{data.function_definition.input[i]}</span>
            </DetailLine>
            {#if input.type === "public"}
              <DetailLine label="Plaintext">
                <span class="mono">{input.plaintext}</span>
              </DetailLine>
            {:else if input.type === "private"}
              <DetailLine label="Ciphertext">
                <span class="mono">{input.ciphertext}</span>
              </DetailLine>
            {:else if input.type === "record"}
              <DetailLine label="Serial number">
                <span class="mono">{input.serial_number}</span>
              </DetailLine>
              <DetailLine label="Tag">
                <span class="mono">{input.tag}</span>
              </DetailLine>
            {:else if input.type === "external_record"}
              <DetailLine label="Commitment">
                <span class="mono">{input.input_commitment}</span>
              </DetailLine>
            {:else}
              Not Implemented
            {/if}
          </div>
          <div class="details-line"></div>
        </div>
      {/each}
    </div>
  {/snippet}
  {#snippet output(binds)}
    <div class="tab" bind:this={binds.output}>
      {#each transition.outputs as output, i}
        <div class="header-xs">Output #{i + 1}</div>
        <div class="details compact">
          <div class="group">
            <DetailLine label="Type">
              {output.type.charAt(0).toUpperCase() + output.type.slice(1).replace("_", " ")}
              <span class="mono">{data.function_definition.output[i]}</span>
            </DetailLine>
            {#if output.type === "public"}
              <DetailLine label="Plaintext">
                <span class="mono">{output.plaintext}</span>
              </DetailLine>
            {:else if output.type === "private"}
              <DetailLine label="Ciphertext">
                <span class="mono">{output.ciphertext}</span>
              </DetailLine>
            {:else if output.type === "record"}
              <DetailLine label="Commitment">
                <span class="mono">{output.commitment}</span>
              </DetailLine>
              <DetailLine label="Ciphertext">
                <span class="mono">{output.record_ciphertext._text}</span>
              </DetailLine>
              <div class="record-field">
                <DetailLine label="owner">
                  <span class="mono">{output.record_ciphertext.owner}</span>
                </DetailLine>
                {#each Object.entries(output.record_ciphertext.data) as [key, value]}
                  <DetailLine label={key}>
                    <span class="mono">{Object.values(value)[0]}</span>
                  </DetailLine>
                {/each}
              </div>
            {:else if output.type === "external_record"}
              <DetailLine label="Commitment">
                <span class="mono">{output.commitment}</span>
              </DetailLine>
            {:else if output.type === "future"}
              <DetailLine label="Future">
                <button class="link" onclick={() => tabs.set_active("finalize")}>
                  <span class="mono">{output.future.program_id}/{output.future.function_name}(...)</span>
                </button>
              </DetailLine>
            {:else}
              Not Implemented
            {/if}
          </div>
          <div class="details-line"></div>
        </div>
      {/each}
    </div>
  {/snippet}
  {#snippet finalize(binds)}
    {#if transition.outputs.length > 0 && transition.outputs.at(-1).type === "future"}
      <div class="tab" bind:this={binds.finalize}>
        {#each transition.outputs.at(-1).future.arguments as input, i}
          <div class="header-xs">Input #{i + 1}</div>
          <div class="details compact">
            <div class="group">
              <DetailLine label="Type">
                {#if typeof input === "string"}
                  Plaintext
                {:else}
                  Future
                {/if}
              </DetailLine>
              {#if typeof input === "string"}
                <DetailLine label="Plaintext">
                  <span class="mono">{input}</span>
                </DetailLine>
              {:else}
                <DetailLine label="Future">
                  <span class="mono">{input.program_id}/{input.function_name}(...)</span>
                </DetailLine>
              {/if}
            </div>
            <div class="details-line"></div>
          </div>
        {/each}
      </div>
    {/if}
  {/snippet}
</Tabs>

<PageInformation
  title="Transition"
  description="A transition in the Aleo blockchain represents a change in the program state, triggered by a specific transaction. It involves the execution of functions or operations within the network’s smart contracts. Transitions are integral to updating the state and logic of deployed programs."
  icon="transition-icon"
/>
