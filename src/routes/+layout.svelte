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

  #footer-settings-timezone {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;

    a {
      color: $blue-500;
      text-decoration-line: none;
      line-height: 1.25rem;
    }
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
  import { env } from "$env/dynamic/public";

  export let data

  console.log(data.sync_info)

  let analytic_notices: string[] = []
  if (env.PUBLIC_HAS_CLOUDFLARE) {
    analytic_notices.push("Contains Cloudflare analytics.")
  }
  if (env.PUBLIC_HAS_PLAUSIBLE) {
    analytic_notices.push("Contains self-hosted Plausible analytics.")
  }
  const analytic_notice = analytic_notices.join(" ")
</script>

<Nav />

<div class="container">
  <slot></slot>
  <footer>
    <div id="footer-column">

      <div id="footer-row">
        <div id="footer-logo-copyright">
          <div id="footer-logo"></div>
          <div>Aleo Explorer made by Haruka and contributors. <div class="copyleft">&copy;</div> 2022-{(new Date()).getFullYear()}</div>
        </div>
        <div id="footer-settings">
          <div id="footer-settings-timezone">
            <div>Timezone display</div>
            <div><a href="#">UTC</a></div>
          </div>
        </div>
      </div>

      <div class="footer-line"></div>

      <div id="footer-row">
        <div id="footer-links">
          <a href="#">FAQ</a>
          <a href="#">Feedback</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div id="footer-external-links">
          <a href="#">GitHub</a>
          <a href="#">Twitter (X)</a>
        </div>
      </div>

      <div class="footer-line"></div>

    </div>

    <div id="footer-analytics">{ analytic_notice }</div>
  </footer>
</div>