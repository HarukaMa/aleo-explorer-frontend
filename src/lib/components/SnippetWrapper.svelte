<script lang="ts">

  import type { Snippet } from "svelte"

  let { snippet, value }: { snippet: Snippet<[{ value: any }]>, value: any } = $props()

</script>

{@render snippet(value)}