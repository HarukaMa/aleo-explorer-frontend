<script lang="ts">
  import home_bg from "$lib/assets/images/home_bg.svg"
  import SearchBar from "$lib/SearchBar.svelte"

  export let data

  const summary_data = [
    [
      { name: "Recent Blocks", value: data.recent_blocks.length },
    ],
    [
      { name: "Recent Transactions", value: data.sync_info.explorer_height },
    ],
  ]

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
            <div>{row.value}</div>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div id="blocks">
    <header>Blocks</header>

  </div>
</div>

{JSON.stringify(data.recent_blocks)}