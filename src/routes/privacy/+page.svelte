<script lang="ts">
  import PageHeader from "$lib/components/PageHeader.svelte"
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .content {
    max-width: 700px;
    margin: 40px auto 0;
  }

  h2 {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 0px;
  }

  p {
    color: #333;
    margin: 0px;
    margin-top: 8px;
  }

  a {
    color: $blue-500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>

<div class="header">
  <PageHeader content="Privacy Policy" />
</div>

<div class="container">
<div class="content">
  <h2>Introduction</h2>
  <p>
    Welcome to AleoScan, an explorer for the Aleo blockchain. Your privacy is of utmost importance to us. This
    policy outlines how we handle your data when you use our services.
  </p>

  <h2>Data Collection and Usage</h2>
  <p>
    When you use AleoScan, certain information about your requests will be recorded in our web server logs
    and analytics data. This information may include your IP address, browser type, and the pages you visit.
    While this data can potentially be used to link different addresses based on your activities, we assure you
    that we do not use this information for any malicious purposes. Additionally, we do not share this data with
    third parties unless legally required.
  </p>

  <h2>Embedded Analytics Scripts</h2>
  <p>
    Depending on the configuration of our code, AleoScan may have various analytics scripts embedded on its
    pages. The following describes the services we currently use:
  </p>

  <h2>Cloudflare</h2>
  <p>
    AleoScan uses Cloudflare to protect our server from malicious attacks. All web requests pass through
    Cloudflare's CDN nodes before reaching our server. Cloudflare collects data about these requests, and you
    can review their policies here:
  </p>
  <div class="links">
    <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare's Privacy Policy</a>
    <a href="https://www.cloudflare.com/cookie-policy/" target="_blank" rel="noopener noreferrer">Cloudflare's Cookie Policy</a>
  </div>
  <p>
    We have access to aggregated request data and individual security logs through Cloudflare to help us
    identify and mitigate potential security threats.
  </p>
  <p>
    In addition, we use Cloudflare Analytics to gather performance data and Core Web Vitals statistics. This
    information helps us optimize AleoScan for a better user experience.
  </p>

  <h2>Plausible Analytics (Self-hosted)</h2>
  <p>
    AleoScan utilizes a self-hosted instance of Plausible Analytics, an open-source alternative to Google
    Analytics. Plausible collects simple, anonymized metrics to help us understand how our website is used. We
    do not collect any personal data with Plausible Analytics.
  </p>
  <p>
    The data collected by Plausible is open and transparent. You can view the live data we collect by visiting:
    <a href="https://p.hamp.app/aleoscan.io" target="_blank" rel="noopener noreferrer">Live data</a>.
  </p>
  <p>
    To opt out of Plausible Analytics, please click the "Opt Out" link in the footer of our website.
  </p>

  <h2>Data Security</h2>
  <p>
    We take data security seriously and implement measures to protect your information from unauthorized
    access, alteration, disclosure, or destruction.
  </p>

  <h2>Changes to This Privacy Policy</h2>
  <p>
    We may update this privacy policy from time to time. Any changes will be posted on this page, and we will
    notify you of significant changes via email or through a notice on our website.
  </p>

  <h2>Contact Us</h2>
  <p>
    If you have any questions or suggestions regarding this privacy policy, please contact us at
    <a href="mailto:privacy@aleoscan.io">privacy@aleoscan.io</a>.
  </p>
</div>
</div>
