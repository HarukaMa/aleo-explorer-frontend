<script lang="ts">
  type SeoProps = {
    title: string
    description: string
    keywords: string
  }

  let { title, description, keywords }: SeoProps = $props()
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
</svelte:head>
