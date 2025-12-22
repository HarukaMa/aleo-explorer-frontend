<script lang="ts">
  let { is_index = false } = $props()

  let input: HTMLInputElement | undefined = $state(undefined)

  function focus_search() {
    if (input) {
      input.focus()
    }
  }

  function clear_search(this: HTMLFormElement, e: Event) {
    e.preventDefault()
    this.submit()
    if (input) {
      input.blur()
      input.value = ""
    }
    return false
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

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

    .keyboard-shortcut {
      padding: 0.5rem 1.0625rem;
      border-radius: 0.5rem;
      background: $grey-50;
      color: $grey-400;
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  .search-bar-container {
    display: inline-flex;
    height: 2.5rem;
    width: 25rem;
    box-sizing: border-box;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid $grey-100;
    transition: border 0.2s ease-out;
    font-size: 0.875rem;

    .search-icon {
      height: 1rem;
      width: 1rem;
      background-image: $search-icon;
    }

    &:focus-within {
      border-color: $blue-500;
      transition: all 0.2s ease-out;
    }

    .keyboard-shortcut {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 1.5rem;
      width: 1.5rem;
      border-radius: 0.25rem;
      background: $grey-50;
      color: $grey-400;
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .search-bar-container {
      width: 90vw;
    }

    .keyboard-shortcut {
      display: none !important;
    }
  }

  form {
    flex-grow: 1;

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

  .with-long-placeholder {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .with-short-placeholder {
    display: none;

    @media (max-width: 768px) {
      display: flex;
    }
  }
</style>

<div
  class={is_index ? "home-search-bar-container" : "search-bar-container"}
  onclick={focus_search}
  onkeydown={focus_search}
  role="button"
  tabindex="0"
>
  <div class="search-icon"></div>
  <form action="/search" onsubmit={clear_search}>
    <input bind:this={input} name="q" class="with-long-placeholder" placeholder="Search for address, transaction, validator..." type="text" />
    <input bind:this={input} name="q" class="with-short-placeholder" placeholder="Address, transaction, validator" type="text" />
  </form>
  <div class="keyboard-shortcut">/</div>
</div>

<svelte:window
  on:keydown={(e) => {
    if (input) {
      if (e.key === "/" && !input.contains(document.activeElement)) {
        e.preventDefault()
        e.stopPropagation()
        input.focus()
      } else if (e.key === "Escape" && input.contains(document.activeElement)) {
        e.preventDefault()
        e.stopPropagation()
        input.blur()
      }
    }
  }}
/>
