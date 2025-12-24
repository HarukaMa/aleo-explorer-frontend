<script lang="ts">
  type SeoProps = {
    title: string
    description: string
  }

  let { title, description }: SeoProps = $props()
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>
