<script>
  import { ButtonLinkClass } from "$lib/types.js"
  import Button from "$lib/components/Button.svelte"

  import { page } from "$app/state"

  console.log(page.error)
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .error-container {
    display: flex;
    flex-direction: column;
    padding: 7.5rem 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1rem;
  }

  .error-code {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 6.25rem;
    font-weight: 600;
    color: $blue-500;
  }

  .error-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error-title {
    font-family: "Montserrat Variable", sans-serif;
    font-weight: 600;
    line-height: 1.5rem;
    font-size: 1.125rem;
  }
</style>

<div class="error-container">
  <div class="error-code">{page.status}</div>
  <div class="error-body">
    <div class="error-title">{page.error?.error}</div>
    {page.error?.message}
  </div>

  <Button Content="Go to homepage" cls={ButtonLinkClass.Primary} href="/"></Button>
</div>
