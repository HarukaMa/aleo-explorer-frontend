<script lang="ts">
  import home_bg from "$lib/assets/images/home_bg.svg";
  import SearchBar from "$lib/SearchBar.svelte";

  export let data;

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
    font-family: Montserrat, sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.025rem;
  }

  @supports (font-variation-settings: normal) {
    .big-title { font-family: "Montserrat Variable", system-ui; }
  }

  .search-bar {
    margin-top: 1.5rem;
  }
</style>

<div class="background" style:--home-bg=url({home_bg})></div>

<div class="big-title">Explore Aleo Blockchain</div>

<div class="search-bar">
  <SearchBar homepage />
</div>

{JSON.stringify(data.data)}