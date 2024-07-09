<script lang="ts">
  import home_bg from "$lib/assets/images/home_bg.svg"
  import SearchBar from "$lib/components/SearchBar.svelte"
  import Number from "$lib/components/Number.svelte"
  import { current_time_mode, format_time } from "$lib/time_mode.svelte"

  let { data } = $props()

  const block_time = new Date(data.summary.latest_timestamp * 1000)
  const time_mode = current_time_mode()

  let summary_data = $derived([
    [
      { name: "Latest block", value: { number: data.summary.latest_height } },
      { name: "Block time", value: format_time(block_time, time_mode.value) },
      { name: "Active validators", value: data.summary.validators },
      { name: "Validator participation rate (1h)", value: (data.summary.participation_rate * 100).toFixed(2) + "%" },
    ],
    [
      {
        name: "Epoch",
        value: `${Math.floor(data.summary.latest_height / 360)} (${data.summary.latest_height % 360}/360)`,
      },
      { name: "Proof target", value: { number: data.summary.proof_target } },
      { name: "Coinbase target", value: { number: data.summary.coinbase_target } },
      { name: "Puzzle solving rate (15m)", value: { number: data.summary.network_speed, precision: 2, unit: "s/s" } },
    ],
  ])

</script>

<style lang="scss">
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 600px;
    background-image: var(--home-bg);
    background-size: cover;
    background-position: center;
    z-index: -999;
  }

  .big-title {
    margin-top: 8.5rem;
    font-family: "Montserrat Variable", sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.025rem;
  }

  .search-bar {
    margin-top: 1.5rem;
  }

  #summary {
    margin-top: 3rem;
    display: flex;
    gap: 8rem;
    margin-right: 4rem;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 50%;
  }

  .row {
    display: flex;
    line-height: 1.25rem;

    > div {

      &:nth-child(1) {
        display: inline;
        width: 50%;
      }

      &:nth-child(2) {
        display: inline;
        width: 50%;
        font-weight: 700;
      }

    }
  }

  #blocks {
    margin-top: 8rem;

    header {
      font-family: "Montserrat Variable", sans-serif;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 2rem;
    }
  }

</style>

<div class="background" style:--home-bg=url({home_bg})></div>

<div class="big-title">Explore Aleo Blockchain</div>

<div class="search-bar">
  <SearchBar homepage />

  <div id="summary">
    {#each summary_data as column}
      <div class="column">
        {#each column as row}
          <div class="row">
            <div>{row.name}</div>
            {#if typeof row.value === "object"}
              <Number {...row.value} />
            {:else}
              <div>{row.value}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div id="blocks">
    <header>Blocks</header>

  </div>
</div>
