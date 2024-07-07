<style lang="scss">

  @import 'static/styles/global';

  .container {
    max-width: 1136px;
    margin: 0 auto;
  }

  footer {
    display: flex;
    padding: 5rem 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  #footer-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  #footer-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  #footer-logo-copyright {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
  }

  #footer-logo {
    background-image: $mono-logo;
    height: 32px;
    width: 32px;
  }

  .copyleft {
    transform: rotate(180deg);
    display: inline-block;
  }

  #footer-settings {
    display: inline-flex;
    gap: 1.75rem;
  }

  #footer-settings button, #footer-analytics button {
    all: unset;
    color: $blue-500;
    text-decoration-line: none;
    line-height: 1.25rem;

    &:hover {
      cursor: pointer;
    }
  }

  #footer-settings-timezone {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .footer-line {
    width: 100%;
    height: 1px;
    background-color: $grey-100;
  }

  #footer-links, #footer-external-links {
    display: flex;
    gap: 2rem;

    a {
      color: black;
      text-decoration-line: none;
    }

  }
</style>

<script lang="ts">
  import Nav from "$lib/Nav.svelte"
  import { env } from "$env/dynamic/public"
  import { TimeMode } from "$lib/types"
  import { browser } from "$app/environment"
  import { writable, type Writable } from "svelte/store"
  import { getCookie } from "$lib/utils.js"
  import { setContext } from "svelte"

  export let data

  let time_display_value: TimeMode
  if (browser) {
    const storage_value = getCookie("time_display") || localStorage.getItem("time_display")
    // noinspection JSIncompatibleTypesComparison
    if (storage_value !== null && ["UTC", "Local", "Relative"].includes(storage_value)) {
      // @ts-expect-error
      time_display_value = TimeMode[storage_value]
    } else {
      time_display_value = TimeMode.UTC
    }
  } else {
    if (data.time_display !== undefined && ["UTC", "Local", "Relative"].includes(data.time_display)) {
      // @ts-expect-error
      time_display_value = TimeMode[data.time_display]
    } else {
      time_display_value = TimeMode.UTC
    }
  }

  export const time_display: Writable<TimeMode> = writable(time_display_value)

  let plausible_opt_out_value: boolean
  if (browser) {
    plausible_opt_out_value = (getCookie("plausible_opt_out") || localStorage.getItem("plausible_opt_out")) === "true"
  } else {
    plausible_opt_out_value = data.plausible_opt_out === "true"
  }

  export const plausible_opt_out: Writable<boolean> = writable(plausible_opt_out_value)

  time_display.subscribe((value) => {
    if (!browser) return
    localStorage.setItem("time_display", TimeMode[value])
    document.cookie = `time_display=${TimeMode[value]};`
  })
  plausible_opt_out.subscribe((value) => {
    if (!browser) return
    localStorage.setItem("plausible_opt_out", value.toString())
    document.cookie = `plausible_opt_out=${value};`
  })

  let time_display_mode: string
  $: {
    switch ($time_display) {
      case TimeMode.UTC:
        time_display_mode = "UTC"
        break
      case TimeMode.Local:
        time_display_mode = "Local"
        break
      case TimeMode.Relative:
        time_display_mode = "Relative"
        break
    }
  }

  function switch_timezone() {
    time_display.update((prev) => {
      if (prev === TimeMode.UTC) {
        return TimeMode.Local
      } else if (prev === TimeMode.Local) {
        return TimeMode.Relative
      } else {
        return TimeMode.UTC
      }
    })
  }

  let analytic_notices: string[] = []
  if (env.PUBLIC_HAS_CLOUDFLARE) {
    analytic_notices.push("Contains Cloudflare analytics.")
  }
  if (env.PUBLIC_HAS_PLAUSIBLE) {
    analytic_notices.push("Contains self-hosted Plausible analytics.")
  }
  const analytic_notice = analytic_notices.join(" ")

  function toggle_plausible_opt_out() {
    plausible_opt_out.update((prev) => !prev)
  }

  let toggle_text: string
  $: {
    if ($plausible_opt_out) {
      toggle_text = "Opt in"
    } else {
      toggle_text = "Opt out"
    }
  }

  setContext("time_display", time_display)
</script>

<Nav />

<div class="container">
  <slot></slot>
  <footer>
    <div id="footer-column">

      <div id="footer-row">
        <div id="footer-logo-copyright">
          <div id="footer-logo"></div>
          <div>Aleo Explorer made by Haruka and contributors. <span class="copyleft">&copy;</span>
            2022-{(new Date()).getFullYear()}</div>
        </div>
        <div id="footer-settings">
          <div id="footer-settings-timezone">
            <div>Time display</div>
            <div>
              <button on:click="{switch_timezone}">{time_display_mode}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-line"></div>

      <div id="footer-row">
        <div id="footer-links">
          <a href="/faq">FAQ</a>
          <a href="/feedback">Feedback</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div id="footer-external-links">
          <a href="https://github.com/HarukaMa/aleo-explorer" target="_blank">GitHub</a>
          <a href="https://x.com/Aleo_Scan" target="_blank">Twitter (X)</a>
        </div>
      </div>

      <div class="footer-line"></div>

    </div>

    <div id="footer-analytics">
      { analytic_notice }
      {#if env.PUBLIC_HAS_PLAUSIBLE}
        <button on:click="{toggle_plausible_opt_out}">{toggle_text}</button>
      {/if}
    </div>
  </footer>
</div>