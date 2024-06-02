<style lang="scss">

  @import 'static/styles/global';

  .container {
    max-width: 1136px;
    margin: 0 auto;
  }

</style>

<script lang="ts">
  import Nav from "$lib/Nav.svelte";
</script>

<Nav />

<div class="container">
  <slot></slot>
  <div class="footer-container">

  </div>
</div>