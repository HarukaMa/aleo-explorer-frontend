<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: className }: Props = $props();
</script>

<div class="table-container {className ?? ''}">
  {@render children()}
</div>

<style>
  .table-container {
    max-width: 100%;
    margin-top: 2.5rem;
  }
</style>
