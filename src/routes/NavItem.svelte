<script lang="ts">
  export let name: string;
  export let path: string;
</script>

<style lang="scss">

  @import '/static/global';

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