<script lang="ts">
  interface NavItem {
    name: string
    path: string
  }

  let { name, path }: NavItem = $props()
</script>

<style lang="scss">

  @import '../../../static/styles/variables';

  .nav-link-menu-item {
    padding: 0.5rem;
    color: black;
    text-decoration: none;

    &:hover {
      border-radius: 0.5rem;
      background: $grey-25;
    }
  }

</style>

<a href="{path}" class="nav-link-menu-item">
  <div>
    {name}
  </div>
</a>