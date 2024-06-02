<script lang="ts">

  export let homepage: boolean = false;

</script>

<style lang="scss">

  @import "static/styles/variables";

  .home-search-bar-container {
    display: inline-flex;
    height: 4rem;
    padding: 0.5rem 0.75rem 0.5rem 1rem;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    background: white;
    border-radius: 1rem;
    border: 2px solid $grey-100;

    .search-icon {
      height: 1.5rem;
      width: 1.5rem;
      background-image: $search-icon;
    }
  }
</style>

{#if homepage}
  <div class="home-search-bar-container">
    <div class="search-icon"></div>
    <form action=""></form>
  </div>
{:else}

{/if}