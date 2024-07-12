<script lang="ts">

  import type { Component } from "svelte"

  interface Link {
    href: string
    child_component: Component<any>
  }

  let { href, child_component, ...rest }: Link = $props()

</script>

<style lang="scss">
  @import 'static/styles/variables';

  a {
    color: $blue-500;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

<a href={href}>
  <svelte:component this={child_component} {...rest} />
</a>