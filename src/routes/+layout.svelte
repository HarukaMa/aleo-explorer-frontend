<!-- Contains code from https://github.com/scosman/sveltekit-navigation-loader/ -->
<!--
MIT License

Copyright (c) 2023 Steve Cosman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<!-- Please note that this file is still subject to AGPL nonetheless. -->

<style lang="scss">

  @import 'static/styles/global';

  .container {
    max-width: 1620px;
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

  #footer-row, #footer-row-links {
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

  #footer-settings button, #footer-logo-copyright button {
    all: unset;
    color: $blue-500;
    text-decoration-line: none;
    line-height: 1.25rem;

    &:hover {
      cursor: pointer;
      text-decoration: underline;
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
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 768px) {
    #footer-row {
      flex-direction: column;
      gap: 1rem;
    }

    #footer-logo-copyright {
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    #footer-settings {
      flex-direction: column;
    }

    #footer-settings-timezone {
      align-items: flex-start;
      text-align: left;
    }

    #footer-links, #footer-external-links {
      flex-direction: column;
      gap: 1rem;
      width: 50%;
    }
  }

  .navigation-loader {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    z-index: 50;
    background-color: $blue-500;
  }

</style>

<script lang="ts">
  import Nav from "$lib/components/Nav.svelte"
  import { env } from "$env/dynamic/public"
  import { current_time_mode, format_time_relative, TimeMode } from "$lib/time_mode.svelte"
  import { browser } from "$app/environment"
  import { getCookie } from "$lib/utils.js"
  import { setContext, type Snippet } from "svelte"
  import TopBanner from "$lib/components/TopBanner.svelte"
  import { navigating, page } from "$app/stores"
  import { expoOut } from "svelte/easing"
  import { slide } from "svelte/transition"

  let { data, children } = $props()

  let is_index = $derived($page.url.pathname === "/")

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

  let before_container: Snippet | undefined = $state()

  // noinspection JSUnusedGlobalSymbols
  setContext("before_container", {
    set snippet(value: Snippet) {
      before_container = value
    },
  })
</script>

{#if $navigating}
  <!--
    Loading animation for next page since svelte doesn't show any indicator.
     - delay 100ms because most page loads are instant, and we don't want to flash
     - long 12s duration because we don't actually know how long it will take
     - exponential easing so fast loads (>100ms and <1s) still see enough progress,
       while slow networks see it moving for a full 12 seconds
  -->
  <div
    class="navigation-loader"
    in:slide={{ delay: 100, duration: 12000, axis: "x", easing: expoOut }}
  ></div>
{/if}

{#if data.sync_info.out_of_sync}
  <TopBanner>
    {#snippet content()}
      <div>
        The explorer is out of date. The last block synced
        was {format_time_relative(new Date(data.sync_info.last_timestamp * 1000))}.
      </div>
    {/snippet}
  </TopBanner>
{/if}

<Nav is_index={is_index} />

{#if before_container}
  {@render before_container()}
{/if}

<div class="container">
  {@render children()}
  <footer>
    <div id="footer-column">

      <div id="footer-row">
        <div id="footer-logo-copyright">
          <div id="footer-logo"></div>
          <div>AleoScan - Aleo Explorer <span class="copyleft">&copy;</span>
            {(new Date()).getFullYear()}
            <br>
            { analytic_notice }
            {#if env.PUBLIC_HAS_PLAUSIBLE}
              <button class="a" onclick="{toggle_plausible_opt_out}">{toggle_text}</button>
            {/if}
          </div>
        </div>
        <div id="footer-settings">
          <div id="footer-settings-timezone">
            <div>Time display</div>
            <div>
              <button class="a" onclick="{switch_timezone}">{time_display_mode}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-line"></div>

      <div id="footer-row-links">
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

    </div>
  </footer>
</div>