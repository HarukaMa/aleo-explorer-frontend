<script lang="ts">

  import type { Component } from "svelte"

  interface Link {
    href: string
    ChildComponent?: Component<any>
    content?: string

    [key: string]: any
  }

  let { href, ChildComponent, content, ...rest }: Link = $props()

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
  {#if ChildComponent}
    <ChildComponent {ChildComponent} {content} {...rest} />
  {:else}
    {content}
  {/if}
</a>