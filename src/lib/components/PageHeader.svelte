<script lang="ts">
  interface PageHeader {
    icon?: string
    title?: string
    content: string
  }

  let { icon, title, content }: PageHeader = $props()
</script>

<style lang="scss">
  @use "sass:map";

  @use "/static/styles/variables" as *;

  .icon {
    height: 32px;
    width: 32px;
    flex: none;
    background-image: var(--icon);
  }

  .id {
    font-size: 1.375rem;
    font-weight: 600;
    font-family: "Montserrat Variable", sans-serif;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  .title {
    font-size: 1rem;
    line-height: 1.5rem;
  }
</style>

<div class="flex">
  <div class="icon" hidden={icon === undefined || null} style:--icon="var(--{icon})"></div>
  <div class="vert">
    <div class="title" hidden={title === undefined || null}>{title}</div>
    <div class="id">
      {content}
    </div>
  </div>
</div>
