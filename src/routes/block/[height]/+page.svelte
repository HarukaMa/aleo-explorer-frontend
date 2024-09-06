<script lang="ts">

  import type { BeforeContainerState } from "$lib/types"
  import { getContext } from "svelte"
  import Number from "$lib/components/Number.svelte"
  import DetailLine from "$lib/components/DetailLine.svelte"
  import Time from "$lib/components/Time.svelte"

  let { data } = $props()
  let { block, height } = data

  console.log(block)

  let before_container_state: BeforeContainerState = getContext("before_container")
  before_container_state.snippet = before_container

</script>

<style lang="scss">

  @import "static/styles/variables";

  div.header {
    display: flex;
    flex-direction: row;
    margin: 0 1rem;
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
    }
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
    <DetailLine label="Timestamp">
      <Time timestamp={block.block.header.metadata.timestamp} />
    </DetailLine>
  </div>
</div>
