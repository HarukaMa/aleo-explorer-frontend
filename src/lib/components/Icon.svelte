<style lang="scss">

  @import "/static/styles/variables";

  .icon {
    background-size: contain;
  }

</style>

<script lang="ts">

  let { size, icon }: { size: string, icon: string } = $props()

</script>

<div class="icon" style:background-image={"var(--" + icon + ")"} style:height={size} style:width={size}></div>