<script lang="ts">
  import Button from "$lib/components/Button.svelte"
  import { ButtonLinkClass } from "$lib/types"
  import { onMount } from "svelte"
  import { PUBLIC_API_ENDPOINT } from "$env/static/public"

  interface ReadMapping {
    program: string
    mapping: string
    type: string
  }

  let { program, mapping, type }: ReadMapping = $props()

  let result: string | null | undefined = $state(undefined)
  let error: string | undefined = $state(undefined)

  async function search(e) {
    e.preventDefault()
    const input = document.getElementById(`mapping-${program}-${mapping}`) as HTMLInputElement
    const value = input.value
    if (value === "") {
      return
    }
    try {
      let r = await fetch(PUBLIC_API_ENDPOINT + `/v3/mapping/get_value/${program}/${mapping}/${value}`)
      if (r.ok) {
        result = (await r.json()).value
        error = undefined
      } else {
        error = (await r.json()).error
        result = undefined
      }
    } catch (e) {
      error = e.message
      result = undefined
    }
  }

  let input: HTMLInputElement | undefined = $state(undefined)

  let disabled = $state(true)

  onMount(() => {
    if (input) {
      disabled = input.value === ""
    }
  })

  function input_change(e: Event) {
    const input = e.target as HTMLInputElement
    disabled = input.value === ""
  }

  $inspect(program, mapping)
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .mapping {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  .input {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
  }

  .line {
    display: flex;
    gap: 1rem;

    :first-child {
      flex: 1 0 0;

      input {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
        line-height: 1.375rem;
        border: 1px solid $grey-200;
        border-radius: 0.5rem;

        &::placeholder {
          color: $grey-400;
          opacity: 1;
          font-family: "Inconsolata Variable", monospace;
        }
      }
    }
  }

  .result {
    background: $green-50;
    border-radius: 0 1rem 1rem 1rem;
    padding: 1rem;
    width: 100%;

    &.error {
      background: $red-50;
    }
  }
</style>

<div class="mapping">
  <div class="input">
    <span class="mono">{mapping}</span>
    <div class="line">
      <form onsubmit={search}>
        <input
          bind:this={input}
          id="mapping-{program}-{mapping}"
          oninput={input_change}
          placeholder={type.split(" ").at(0)}
          type="text"
        />
      </form>
      <Button Content="Read" action={search} cls={ButtonLinkClass.Primary} disabled={disabled || undefined} />
    </div>
    <span class="dim mono">{type}</span>
  </div>
  <div
    class="result"
    class:error={error !== undefined || result === null}
    hidden={(result === undefined && error === undefined) || null}
  >
    {#if error !== undefined}
      {error}
    {:else if result === null}
      Key not found
    {:else}
      <span class="mono">{result}</span>
    {/if}
  </div>
</div>
