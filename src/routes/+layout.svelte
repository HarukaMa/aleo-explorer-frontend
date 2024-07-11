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
    background-repeat: no-repeat;
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
  import Nav from "$lib/components/Nav.svelte"
  import { env } from "$env/dynamic/public"
  import { current_time_mode, TimeMode } from "$lib/time_mode.svelte"
  import { browser } from "$app/environment"
  import { getCookie } from "$lib/utils.js"
  import { setContext } from "svelte"

  let { data, children } = $props()

  let stored_time_mode: TimeMode
  if (browser) {
    const storage_value = getCookie("time_display") || localStorage.getItem("time_display")
    if (storage_value !== null && ["UTC", "Local", "Relative"].includes(storage_value)) {
      // @ts-expect-error
      stored_time_mode = TimeMode[storage_value]
    } else {
      stored_time_mode = TimeMode.UTC
    }
  } else {
    if (data.time_display !== undefined && ["UTC", "Local", "Relative"].includes(data.time_display)) {
      // @ts-expect-error
      stored_time_mode = TimeMode[data.time_display]
    } else {
      stored_time_mode = TimeMode.UTC
    }
  }

  let time_mode = current_time_mode(stored_time_mode)

  let plausible_opt_out_value: boolean
  if (browser) {
    plausible_opt_out_value = (getCookie("plausible_opt_out") || localStorage.getItem("plausible_opt_out")) === "true"
  } else {
    plausible_opt_out_value = data.plausible_opt_out === "true"
  }

  let plausible_opt_out = $state(plausible_opt_out_value)

  $effect(() => {
    if (!browser) return
    localStorage.setItem("time_display", TimeMode[time_mode.value])
    document.cookie = `time_display=${TimeMode[time_mode.value]};`
  })

  $effect(() => {
    if (!browser) return
    localStorage.setItem("plausible_opt_out", plausible_opt_out.toString())
    document.cookie = `plausible_opt_out=${plausible_opt_out.toString()};`
  })

  let time_display_mode: string = $derived.by(() => {
    switch (time_mode.value) {
      case TimeMode.UTC:
        return "UTC"
      case TimeMode.Local:
        return "Local"
      case TimeMode.Relative:
        return "Relative"
    }
  })

  function switch_timezone() {
    if (time_mode.value === TimeMode.UTC) {
      time_mode.value = TimeMode.Local
    } else if (time_mode.value === TimeMode.Local) {
      time_mode.value = TimeMode.Relative
    } else {
      time_mode.value = TimeMode.UTC
    }
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
    plausible_opt_out = !plausible_opt_out
  }

  let toggle_text: string = $derived.by(() => {
    if (plausible_opt_out) {
      return "Opt in"
    } else {
      return "Opt out"
    }
  })

  setContext("time_mode", time_mode)
</script>

<Nav />

<div class="container">
  {@render children()}
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
              <button onclick="{switch_timezone}">{time_display_mode}</button>
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
        <button onclick="{toggle_plausible_opt_out}">{toggle_text}</button>
      {/if}
    </div>
  </footer>
</div>