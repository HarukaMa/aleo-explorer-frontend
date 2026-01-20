<script lang="ts">
  import type { Snippet } from "svelte"
  import Number from "$lib/components/Number.svelte"

  interface PageHeader {
    icon?: string
    title?: string
    content?: string
    children?: Snippet
    is_number?: boolean
  }

  let { icon, title, content, children, is_number }: PageHeader = $props()

  const icons = import.meta.glob<string>("/src/lib/assets/images/icons/*", { eager: true, import: "default" })
</script>

<style lang="scss">
  @use "sass:map";

  @use "/static/styles/variables" as *;

  .header {
    display: flex;
    flex-direction: row;
    margin: 0 calc(50% - 50vw + 1.5rem);
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

    @media (max-width: 767px) {
      margin: 0 0;
    }

    .flex {
      display: inline-flex;
      justify-content: left;
      align-items: center;
      gap: 1rem;
    }
  }

  .icon {
    height: 40px;
    width: 40px;
    flex: none;
  }

  .id {
    font-size: 1.375rem;
    font-weight: 600;
    font-family: "Montserrat Variable", sans-serif;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  .title {
    font-size: 1rem;
    line-height: 1.5rem;
  }
</style>

<div class="header">
  <div class="flex">
    {#if children}
      {@render children()}
    {:else}
      <div
        class="icon"
        hidden={icon === undefined || null}
        style:background-image="url(&quot;{icons[`/src/lib/assets/images/icons/${icon}.svg`]}&quot;)"
      ></div>
      <div class="vert">
        <div class="title" hidden={title === undefined || null}>{title}</div>
        <div class="id">
          {#if is_number}
            <Number number={content} />
          {:else}
            {content}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
