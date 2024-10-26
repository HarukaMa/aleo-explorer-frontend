<script lang="ts">
  let { size, icon }: { size: string; icon: string } = $props()
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .icon {
    background-size: contain;
  }
</style>

<div class="icon" style:background-image={"var(--" + icon + ")"} style:height={size} style:width={size}></div>
