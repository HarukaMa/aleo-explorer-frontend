<script lang="ts">
  import type { Snippet } from "svelte"

  type Tab = {
    title: string
    id: string
    content: Snippet
  }

  interface Tabs {
    tabs: Tab[]
    active?: string
  }

  let { tabs, active = $bindable() }: Tabs = $props()

  const tabs_id = $props.id()

  let selected = $derived(tabs.find((tab) => tab.id === active) ?? tabs[0])

  function handle_keydown(event: KeyboardEvent & { currentTarget: HTMLButtonElement }, index: number) {
    let next_index: number
    switch (event.key) {
      case "ArrowLeft":
        next_index = (index - 1 + tabs.length) % tabs.length
        break
      case "ArrowRight":
        next_index = (index + 1) % tabs.length
        break
      case "Home":
        next_index = 0
        break
      case "End":
        next_index = tabs.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    active = tabs[next_index].id
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=\"tab\"]")[next_index]?.focus()
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .tabs {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    margin-top: 3rem;
    overflow-x: auto;
  }

  .tab-titles {
    flex-shrink: 0;
  }

  .tab-titles button {
    height: 3rem;
    background-color: transparent;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: color 0.2s,
    background-color 0.2s;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: "Open Sans Variable", system-ui;
    color: black;

    &:focus-visible {
      outline: 2px solid $blue-500;
      outline-offset: 2px;
    }

    &.active {
      color: $blue-500;
      background-color: $blue-50;
      border-radius: 0.5rem;
    }
  }
</style>

{#if selected}
  <div class="tabs">
    <div class="tab-titles" role="tablist" aria-label="Details">
      {#each tabs as tab, index}
        <button
          type="button"
          role="tab"
          id="{tabs_id}-tab-{tab.id}"
          aria-controls="{tabs_id}-panel-{tab.id}"
          aria-selected={selected.id === tab.id}
          tabindex={selected.id === tab.id ? 0 : -1}
          class:active={selected.id === tab.id}
          onclick={() => (active = tab.id)}
          onkeydown={(event) => handle_keydown(event, index)}
        >
          {tab.title}
        </button>
      {/each}
    </div>
  </div>

  {#each tabs as tab}
    <div
      id="{tabs_id}-panel-{tab.id}"
      role="tabpanel"
      aria-labelledby="{tabs_id}-tab-{tab.id}"
      tabindex="0"
      hidden={selected.id !== tab.id}
    >
      {@render tab.content()}
    </div>
  {/each}
{/if}
