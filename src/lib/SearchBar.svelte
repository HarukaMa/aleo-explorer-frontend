<script lang="ts">

  export let homepage: boolean = false;

  let input: HTMLInputElement;

</script>

<style lang="scss">

  @import "static/styles/variables";

  .home-search-bar-container {
    display: inline-flex;
    height: 4rem;
    width: 100%;
    padding-inline: 1rem 0.75rem;
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

    &:focus-within {
      border-color: $blue-500;
    }
  }

  form {
    width: 100%;

    input {
      padding: 0;
      border: none;
      width: 100%;
      line-height: 1.5rem;

      &::placeholder {
        color: $grey-400;
        opacity: 1;
      }

      &:focus-visible {
        outline: none;
      }
    }
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
  }

  .keyboard-shortcut {
    padding: 0.5rem 1.0625rem;
    border-radius: 0.5rem;
    background: $grey-50;
    color: $grey-400;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.5rem;
  }

</style>

{#if homepage}
  <div class="home-search-bar-container">
    <div class="search-icon"></div>
    <form action="/search">
      <input name="q" type="text" placeholder="Search for address, transaction, validator..." bind:this={input} />
    </form>
    <div class="keyboard-shortcut">
      /
    </div>
  </div>
{:else}

{/if}

<svelte:window
  on:keydown={e => {
    if (e.key === "/" && !input.contains(document.activeElement)) {
      e.preventDefault()
      e.stopPropagation()
      input.focus()
    }
  }}
/>