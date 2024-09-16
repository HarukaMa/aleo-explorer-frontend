<script lang="ts">
  import type { Snippet } from "svelte"
  import type { StatusClass } from "$lib/types"

  interface Status {
    cls: StatusClass
    children: Snippet
  }

  let { cls, children }: Status = $props()
</script>

<style lang="scss">
  @import "static/styles/variables";

  .status {
    display: inline-flex;
    height: 1.5rem;
    padding: 0 0.75rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-radius: 1.5rem;
    font-weight: 600;
    line-height: 1.25rem;
  }

  .success {
    background-color: $green-50;
    color: $green-600;
  }

  .info {
    background-color: $blue-50;
    color: $blue-600;
  }

  .warning {
    background-color: $yellow-50;
    color: $yellow-600;
  }

  .danger {
    background-color: $red-50;
    color: $red-600;
  }
</style>

<div class="status {cls}">
  {@render children()}
</div>
