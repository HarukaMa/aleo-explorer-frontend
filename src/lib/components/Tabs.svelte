<script lang="ts">

  type TabDescriptor = {
    title: string,
    id: string,
  }

  let { tabs }: { tabs: TabDescriptor[] } = $props()

  if (!tabs || tabs.length === 0) {
    throw new Error("Tabs component requires at least one tab")
  }

  let activeTab = $state(tabs[0].id)

</script>

<style lang="scss">

</style>

