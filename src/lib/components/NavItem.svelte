<script lang="ts">
  interface NavItem {
    name: string
    path: string
  }

  let { name, path }: NavItem = $props()
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

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

<a class="nav-link-menu-item" href={path}>
  <div>
    {name}
  </div>
</a>
