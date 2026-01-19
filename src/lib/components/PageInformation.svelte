<script lang="ts">
  type PageInformation = {
    title: string
    description: string
    icon?: string
  }

  let { title, description, icon }: PageInformation = $props()

  const icons = import.meta.glob<string>("/src/lib/assets/images/icons/*", { eager: true, import: "default" })
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .page-information {
    display: flex;
    padding: 1.5rem;
    margin-top: 5rem;
    gap: 0.6rem;
    border-radius: 1rem;
    border: 1px solid $grey-100;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    margin-top: 0.25rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
  }

  .text {
    line-height: 1.25rem;
  }

  .title {
    display: inline;
    font-weight: 600;
  }
</style>

<div class="page-information">
  {#if icon}
    <div
      class="icon"
      style:background-image="url(&quot;{icons[`/src/lib/assets/images/icons/${icon}.svg`]}&quot;)"
    ></div>
  {/if}
  <div class="text">
    <span class="title">{title}.</span>
    {description}
  </div>
</div>
