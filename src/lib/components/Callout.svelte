<script lang="ts">
  type Callout = {
    title: string
    description: string
    icon: string
  }

  let { title, description, icon }: Callout = $props()
</script>

<style lang="scss">
  @import "/static/styles/variables";

  .callout {
    display: flex;
    width: 100%;
    padding: 2.5rem 0;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;

    border-radius: 1rem;
    border: 1px solid $grey-100;
  }

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background-size: contain;
  }

  .icon-container {
    display: flex;
    padding: 2rem;
    justify-content: center;
    align-items: center;
    border-radius: 6.25rem;
    background-color: $grey-25;
  }

  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
  }

  .title {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .description {
    line-height: 1.25rem;
    text-align: center;
  }
</style>

<div class="callout">
  <div class="icon-container">
    <div class="icon" style:background-image="var(--{icon})"></div>
  </div>
  <div class="text">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
  </div>
</div>
