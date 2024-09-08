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

  let { data } = $props()
  let { block, height } = data

  console.log(block)

  const ratifications = block.block.ratifications

  let block_reward = 0, puzzle_reward = 0

  for (let ratify of ratifications) {
    if (ratify.type === "block_reward") {
      block_reward = ratify.amount
    } else if (ratify.type === "puzzle_reward") {
      puzzle_reward = ratify.amount
    }
  }

  let total_base_fee = 0, total_priority_fee = 0, total_burnt_fee = 0

  for (let tx of block.block.transactions) {
    if (tx.type === "accepted_execute") {
      if (tx.transaction.fee !== null) {
        const fee = tx.transaction.fee
        total_base_fee += fee.amount[0]
        total_priority_fee += fee.amount[1]
      }
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
        <AleoCredit number={total_base_fee + total_priority_fee} suffix={true}></AleoCredit>
        <span class="secondary">
          <AleoCredit number={total_base_fee}></AleoCredit> base
          {#if total_priority_fee > 0}
            + <AleoCredit number={total_priority_fee}></AleoCredit> priority
          {/if}
          {#if total_burnt_fee > 0}
            + <AleoCredit number={total_burnt_fee}></AleoCredit> burnt
          {/if}
        </span>
      </div>
    </DetailLine>
  </div>
</div>


