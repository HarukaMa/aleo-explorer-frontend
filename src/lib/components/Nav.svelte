<script lang="ts">
  import { PUBLIC_NETWORK } from "$env/static/public"
  import NavItem from "./NavItem.svelte"
  import SearchBar from "$lib/components/SearchBar.svelte"

  let { is_index }: { is_index: boolean } = $props()

  const networks: { [key: string]: string } = {
    mainnet: "Mainnet",
    testnet: "Testnet Beta",
    canary: "Canary Net",
  }

  let network = networks[PUBLIC_NETWORK] || "Unknown Network"

  const blockchain_routes = [
    { name: "Blocks", path: "/blocks" },
    { name: "Validators", path: "/validators" },
    { name: "Programs", path: "/programs" },
    { name: "Transactions", path: "/transactions" },
    { name: "Nodes", path: "/nodes" },
  ]

  const proving_routes = [
    { name: "Incentive dashboard", path: "/incentive" },
    { name: "Calculator", path: "/calculator" },
  ]

  const developers_routes = [
    { name: "Tools", path: "/tools" },
    { name: "API", path: "/api/docs" },
  ]
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  /* top bar related */

  nav {
    display: flex;
    height: 4.5rem;
    align-items: center;
  }

  .nav-main {
    display: flex;
    //max-width: 1136px;
    margin: 0 auto;
    height: 4.5rem;
    align-items: center;
    flex-grow: 1;
  }

  .nav-main-title {
    display: flex;
    align-items: center;
  }

  .title-logo {
    display: inline-block;
    height: 1.5rem;
    width: 8.375rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 134 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M47.74 19.83V4h3.32v15.83h-3.32Zm35.56-.21c1.1.3 2.24.47 3.43.47 1.42 0 2.6-.22 3.52-.64a4.9 4.9 0 0 0 2.11-1.69c.47-.7.7-1.46.7-2.3a3.54 3.54 0 0 0-1.72-3.18 7.12 7.12 0 0 0-1.7-.75c-.62-.18-1.24-.35-1.86-.49-.61-.14-1.18-.28-1.69-.43a3.85 3.85 0 0 1-1.23-.55 1.13 1.13 0 0 1-.47-.94c0-.33.09-.61.27-.85.19-.26.5-.47.92-.62.43-.16.97-.24 1.64-.24a8.73 8.73 0 0 1 4.14 1.17l1.07-2.62a7.8 7.8 0 0 0-2.41-.98 11.4 11.4 0 0 0-2.78-.34c-1.4 0-2.58.21-3.52.64-.92.41-1.62.97-2.09 1.69a4.2 4.2 0 0 0-.68 2.32c0 .8.16 1.45.47 1.96.33.52.75.93 1.26 1.24.51.31 1.07.57 1.68.77.63.2 1.25.37 1.86.51.63.13 1.2.27 1.7.43.52.14.93.33 1.24.57.32.23.47.54.47.94 0 .31-.1.6-.3.83a2 2 0 0 1-.93.58c-.42.13-.96.2-1.65.2a8.64 8.64 0 0 1-4.92-1.57l-1.18 2.6c.67.52 1.55.94 2.65 1.27Zm31.54-1.22v1.43h3.11v-6.55c0-1.75-.48-3.04-1.45-3.86-.96-.83-2.32-1.24-4.07-1.24-.91 0-1.8.12-2.69.36a7.2 7.2 0 0 0-2.26 1.03l1.2 2.32a5.7 5.7 0 0 1 3.3-1.07c.9 0 1.56.2 1.98.6.45.4.67.96.67 1.67h-2.65c-1.17 0-2.11.15-2.84.45a3.3 3.3 0 0 0-1.6 1.2c-.32.5-.49 1.1-.49 1.78 0 .66.17 1.25.52 1.77.34.53.83.95 1.47 1.26.64.3 1.4.45 2.3.45 1.01 0 1.83-.2 2.47-.58.44-.26.78-.6 1.03-1.02Zm-.21-2.2v-1.17h-2.29c-.78 0-1.32.13-1.62.38-.28.26-.42.58-.42.96 0 .43.16.77.49 1.03.34.24.8.36 1.38.36.56 0 1.05-.13 1.5-.38.44-.27.76-.67.96-1.18Zm15.75-7.46a5.2 5.2 0 0 0-2.44-.56c-.98 0-1.85.2-2.62.62a4.3 4.3 0 0 0-1.17.92V8.35h-3.18v11.48h3.33v-5.68c0-.7.1-1.29.34-1.74.24-.46.56-.8.98-1a3 3 0 0 1 1.43-.35c.74 0 1.3.22 1.7.66.42.44.62 1.13.62 2.05v6.06h3.33v-6.57c0-1.17-.2-2.12-.62-2.86a3.85 3.85 0 0 0-1.7-1.66ZM100.73 20a7.12 7.12 0 0 1-3.3-.75 5.84 5.84 0 0 1-2.29-2.1 5.79 5.79 0 0 1-.8-3.06c0-1.15.26-2.17.8-3.05.56-.9 1.32-1.6 2.29-2.1a6.96 6.96 0 0 1 3.3-.76 6.3 6.3 0 0 1 3.16.77c.9.5 1.56 1.22 1.98 2.15l-2.58 1.4a2.84 2.84 0 0 0-2.58-1.58c-.57 0-1.08.12-1.54.38a2.8 2.8 0 0 0-1.08 1.08 3.52 3.52 0 0 0-.39 1.71c0 .67.13 1.24.39 1.7a2.86 2.86 0 0 0 2.62 1.48c.53 0 1.01-.12 1.45-.36.46-.26.83-.66 1.13-1.22l2.58 1.4a4.7 4.7 0 0 1-1.98 2.16c-.9.5-1.95.75-3.16.75Zm-27.67 0a6.79 6.79 0 0 1-3.26-.77 5.98 5.98 0 0 1-2.24-2.09 5.79 5.79 0 0 1-.81-3.05 5.72 5.72 0 0 1 3.05-5.15 6.79 6.79 0 0 1 3.26-.76c1.21 0 2.3.26 3.25.77a5.62 5.62 0 0 1 3.05 5.14c0 1.14-.27 2.16-.81 3.05a5.77 5.77 0 0 1-2.24 2.1c-.96.5-2.04.76-3.25.76Zm0-2.73a2.75 2.75 0 0 0 2.54-1.47 3.6 3.6 0 0 0 .39-1.7 3.5 3.5 0 0 0-.39-1.72 2.75 2.75 0 0 0-2.54-1.47 2.9 2.9 0 0 0-2.56 1.47 3.52 3.52 0 0 0-.38 1.71c0 .65.13 1.22.38 1.7a2.9 2.9 0 0 0 2.56 1.48ZM56.4 19.23c1 .51 2.15.77 3.46.77a7.5 7.5 0 0 0 2.75-.47 5.3 5.3 0 0 0 1.99-1.39l-1.77-1.92a3.9 3.9 0 0 1-2.88 1.11c-.69 0-1.28-.12-1.8-.36-.5-.26-.89-.62-1.17-1.09a3.1 3.1 0 0 1-.32-.85h8.68a50.2 50.2 0 0 0 .07-.9 6.1 6.1 0 0 0-.8-3.18 5.24 5.24 0 0 0-2.15-2.04 6.2 6.2 0 0 0-3.03-.73 6.4 6.4 0 0 0-3.13.77 5.65 5.65 0 0 0-2.99 5.14c0 1.14.27 2.16.81 3.05a5.7 5.7 0 0 0 2.28 2.1Zm.22-6.14h5.65a2.92 2.92 0 0 0-.32-.98 2.57 2.57 0 0 0-1-1.03 2.85 2.85 0 0 0-1.5-.38c-.56 0-1.07.13-1.51.38a2.86 2.86 0 0 0-1.32 2.01Zm-20.28-8.2-6.65 14.94h3.54l1.33-3.2h6.92l1.33 3.2h3.62L39.75 4.9h-3.42Zm1.69 3.4 2.36 5.72h-4.74l2.38-5.72Z' clip-rule='evenodd'/%3E%3Cpath fill='%231DA1F2' d='M19.73 24h4l-8-24H8L0 24h7.73l1.34-4h5.33l-1.33-4H10.4l3.33-10 6 18Z'/%3E%3C/svg%3E");
  }

  .title-network-indicator-container {
    margin: auto 0 auto 0.5rem;
    display: inline-flex;
    padding: 0 0.75rem;
    height: 1.5rem;
    justify-content: center;
    align-items: center;
    border: 1px solid $grey-100;
    border-radius: 1.5rem;
    background: white;
  }

  .title-network-indicator-name {
    display: inline-block;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .nav-links {
    display: flex;
    margin-left: 2.5rem;
    height: 4.5rem;
    align-items: center;
  }

  .nav-link {
    display: flex;
    gap: 0.25rem;
    padding: 1rem;
    align-items: center;
    position: relative;
  }

  @keyframes opacity {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .chevron {
    height: 1rem;
    width: 1rem;
    background-color: black;
    -webkit-mask-image: $chevron-icon;
    mask-image: $chevron-icon;
  }

  .nav-link:hover {
    color: $blue-500;

    .chevron {
      background-color: $blue-500;
      transform: rotate(180deg);
    }

    > .nav-link-menu {
      color: #000;
      display: flex;
      animation: opacity 200ms ease-out;
    }
  }

  .nav-link-menu {
    position: absolute;
    top: 3rem;
    left: -0.5rem;
    display: none;
    flex-direction: column;
    padding: 1rem;
    gap: 0.25rem;
    width: 11.25rem;
    border-radius: 1rem;
    box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.07);
    background: white;
  }

  .search {
    margin-left: auto;
  }

  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      align-items: flex-start;
      height: 9rem;
    }
    .nav-main {
      flex-direction: column;
      padding-top: 1rem;
      align-items: flex-start;
      margin: 0;
      flex-grow: 0;
    }
    .nav-links {
      margin-left: 0;
    }
  }
</style>

<nav>
  <div class="nav-main">
    <div class="nav-main-title">
      <a aria-label="Home" href="/">
        <div class="title-logo"></div>
      </a>
      <div class="title-network-indicator-container">
        <span class="title-network-indicator-name">{network}</span>
      </div>
    </div>
    <div class="nav-links">
      <div class="nav-link">
        Blockchain
        <span class="chevron"></span>

        <div class="nav-link-menu">
          {#each blockchain_routes as { name, path }}
            <NavItem {name} {path} />
          {/each}
        </div>
      </div>

      <div class="nav-link">
        Proving
        <span class="chevron"></span>

        <div class="nav-link-menu">
          {#each proving_routes as { name, path }}
            <NavItem {name} {path} />
          {/each}
        </div>
      </div>

      <div class="nav-link">
        Developers
        <span class="chevron"></span>

        <div class="nav-link-menu">
          {#each developers_routes as { name, path }}
            <NavItem {name} {path} />
          {/each}
        </div>
      </div>
    </div>
  </div>
  {#if !is_index}
    <div class="search">
      <SearchBar {is_index} />
    </div>
  {/if}
</nav>
