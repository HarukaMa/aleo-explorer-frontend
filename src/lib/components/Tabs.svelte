<script lang="ts">
  import type { Snippet } from "svelte"

  type TabDescriptor = {
    title: string
    id: string
  }

  interface Tabs {
    tab_data: TabDescriptor[]
    active?: string
  }

  let { tab_data, active, ...tabs }: Tabs = $props()

  if (!tab_data || tab_data.length === 0) {
    throw new Error("Tabs component requires at least one tab")
  }

  let active_tab = $state(active || tab_data[0].id)

  let snippets: Snippet<[{ [key: string]: HTMLElement }]>[] = $derived(Object.values(tabs))

  let tab_binds: { [key: string]: HTMLElement } = $state({})

  $effect(() => {
    if (!tab_data.map(({ id }) => id).includes(active_tab)) {
      active_tab = tab_data[0].id
    }
    const other_tabs = Object.entries(tab_binds).filter(([id, _]) => id !== active_tab)
    for (const [_, bind] of other_tabs) {
      bind.style.display = "none"
    }
    tab_binds[active_tab].style.display = "block"
  })

  export function set_active(id: string) {
    active_tab = id
  }
</script>

<style lang="scss">
  @import "static/styles/variables";

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
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: "Open Sans Variable", system-ui;
    color: black;

    &.active {
      color: $blue-500;
      background-color: $blue-50;
      border-radius: 0.5rem;
    }
  }
</style>

<div class="tabs">
  <div class="tab-titles">
    {#each tab_data as tab}
      <button class:active={active_tab === tab.id} onclick={() => (active_tab = tab.id)}>
        {tab.title}
      </button>
    {/each}
  </div>
</div>

{#each snippets as tab}
  {@render tab(tab_binds)}
{/each}
