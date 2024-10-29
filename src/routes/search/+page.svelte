<script lang="ts">
  let { data: server_data } = $props()
  let { query, result, error } = $derived(server_data)

  $inspect({ query, result, error })
</script>

<style lang="scss">
</style>
