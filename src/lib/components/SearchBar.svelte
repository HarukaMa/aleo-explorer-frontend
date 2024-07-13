<script lang="ts">

  let { homepage = false } = $props()

  let input: HTMLInputElement | undefined = $state(undefined)

  function focus_search() {
    if (input) {
      input.focus()
    }
  }

</script>

<style lang="scss">

  @import "/static/styles/variables";

  .home-search-bar-container {
    display: inline-flex;
    height: 4rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0.5rem 0.75rem 0.5rem 1rem;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    background: white;
    border-radius: 1rem;
    border: 2px solid $grey-100;
    transition: border 0.2s ease-out;
    font-size: 1rem;

    .search-icon {
      height: 1.5rem;
      width: 1.5rem;
      background-image: $search-icon;
    }

    &:focus-within {
      border-color: $blue-500;
      transition: all 0.2s ease-out;
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

  input {
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
  <div class="home-search-bar-container" onclick={focus_search} aria-hidden="true">
    <div class="search-icon"></div>
    <form action="/search">
      <input name="q" type="text" placeholder="Search for address, transaction, validator..." bind:this={input} />
    </form>
    <div class="keyboard-shortcut">
      /
    </div>
  </div>
{:else}
  <div>Not implemented!</div>
{/if}

<svelte:window
  on:keydown={e => {
    if (e.key === "/" && !input.contains(document.activeElement)) {
      e.preventDefault()
      e.stopPropagation()
      input.focus()
    } else if (e.key === "Escape" && input.contains(document.activeElement)) {
      e.preventDefault()
      e.stopPropagation()
      input.blur()
    }
  }}
/>