<style lang="scss">

  @import '/static/global';

</style>

<script>
  import Nav from "./Nav.svelte";
</script>

<Nav />

<div class="container">
  <slot></slot>
  <div class="footer-container">

  </div>
</div>

