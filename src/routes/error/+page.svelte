<script lang="ts">
  import { page } from "$app/state"

  let placeholder = page.url.searchParams.get("p")
</script>

<style lang="scss">
  .container {
    margin: 7.5rem 0;
  }
</style>

<div class="container">
  {placeholder}
</div>
