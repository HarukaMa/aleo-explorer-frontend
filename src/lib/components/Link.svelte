<script lang="ts">

  import type { Component } from "svelte"

  interface Link {
    href: string
    ChildComponent: Component<any>

    [key: string]: any
  }

  let { href, ChildComponent, ...rest }: Link = $props()

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
  <ChildComponent {...rest} />
</a>