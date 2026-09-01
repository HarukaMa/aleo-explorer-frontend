<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import home_bg from "$lib/assets/images/home_bg.svg"
  import SearchBar from "$lib/components/SearchBar.svelte"
  import FormattedNumber from "$lib/components/Number.svelte"
  import { renderComponent, renderSnippet } from "@tanstack/svelte-table"
  import DataTable from "$lib/components/DataTable.svelte"
  import Epoch from "$lib/components/Epoch.svelte"
  import AleoCredit from "$lib/components/AleoToken.svelte"
  import Time from "$lib/components/Time.svelte"
  import Link from "$lib/components/Link.svelte"
  import { browser } from "$app/environment"
  import Button from "$lib/components/Button.svelte"
  import { type BlockList, ButtonLinkClass } from "$lib/types"
  import Decimal from "decimal.js"
  import { createAppColumnHelper } from "$lib/table"
  import TableContainer from "$lib/components/TableContainer.svelte"

  let { data } = $props()

  let summary = $derived(data.summary)
  let recent_blocks = $derived(data.recent_blocks)

  type SummaryRow =
    | {
    name: string
    kind: "number"
    value: number
    precision?: number
    unit?: string
  }
    | {
    name: string
    kind: "time" | "epoch"
    value: number
  }

  let summary_data: SummaryRow[][] = $derived([
    [
      { name: "Latest block", kind: "number", value: summary.latest_height },
      { name: "Block time", kind: "time", value: summary.latest_timestamp },
      { name: "Validators", kind: "number", value: summary.validators },
      {
        name: "Validator participation rate (5m)",
        kind: "number",
        value: summary.participation_rate * 100,
        precision: 2,
        unit: "%",
      },
    ],
    [
      {
        name: "Epoch",
        kind: "epoch",
        value: summary.latest_height,
      },
      { name: "Proof target", kind: "number", value: summary.proof_target },
      {
        name: "Coinbase target",
        kind: "number",
        value: summary.coinbase_target,
      },
      {
        name: "Puzzle solving rate (15m)",
        kind: "number",
        value: summary.network_speed,
        precision: 2,
        unit: " s/s",
      },
    ],
  ])

  let table_data: BlockList[] = $derived(
    recent_blocks.map((block: any) => ({
      height: block.height,
      timestamp: block.timestamp,
      transactions: block.transaction_count,
      proof_target: block.proof_target,
      coinbase_target: block.coinbase_target,
      block_reward: new Decimal(block.block_reward),
      puzzle_reward: new Decimal(Math.floor((block.coinbase_reward * 2) / 3)),
      puzzle_solutions: block.partial_solution_count,
    })),
  )

  const column = createAppColumnHelper<BlockList>()
  const columns = column.columns([
    column.accessor("height", {
      header: "Height",
      cell: (info) => renderSnippet(height_column, info.getValue()),
    }),
    column.accessor("timestamp", {
      header: "Timestamp",
      cell: (info) => renderComponent(Time, { timestamp: info.getValue() }),
    }),
    column.accessor("transactions", {
      header: "Transactions",
      cell: (info) => renderComponent(FormattedNumber, { number: info.getValue() }),
    }),
    column.accessor("proof_target", {
      header: "Proof target",
      cell: (info) => renderComponent(FormattedNumber, { number: info.getValue() }),
    }),
    column.accessor("coinbase_target", {
      header: "Coinbase target",
      cell: (info) => renderComponent(FormattedNumber, { number: info.getValue() }),
    }),
    column.accessor("block_reward", {
      header: "Block reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
    column.accessor("puzzle_reward", {
      header: "Puzzle reward",
      cell: (info) => renderComponent(AleoCredit, { number: info.getValue() }),
    }),
    column.accessor("puzzle_solutions", {
      header: "Puzzle solutions",
      cell: (info) => renderComponent(FormattedNumber, { number: info.getValue() }),
    }),
  ])

  if (browser) {
    let requesting = false
    const interval = setInterval(async () => {
      if (requesting || document.hidden) return

      const first_block = table_data[0]
      if (first_block === undefined) return

      requesting = true
      try {
        const response = await fetch(
          "/api/index_update?" + new URLSearchParams({ last_block: first_block.height.toString() }),
        )
        if (!response.ok) {
          throw new Error(`Index update failed with status ${response.status}`)
        }
        const new_data: { summary: typeof summary; recent_blocks: typeof recent_blocks } = await response.json()
        summary = new_data.summary
        recent_blocks = new_data.recent_blocks.concat(recent_blocks).slice(0, 10)
      } catch (error) {
        console.error("Failed to update home data", error)
      } finally {
        requesting = false
      }
    }, 5000)
    $effect(() => {
      return () => clearInterval(interval)
    })
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 600px;
    background-image: var(--home-bg);
    background-size: cover;
    background-position: center;
    z-index: -999;
  }

  .big-title {
    margin-top: 8.5rem;
    font-family: "Montserrat Variable", sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: -0.025rem;
  }

  #summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    background-color: white;
    border: 1px solid $grey-100;
    padding: 24px;
    border-radius: 16px;
    :global(.formatted-number),
    :global(.epoch),
    :global(.time) {
      font-weight: 700;
      //letter-spacing: -0.01rem;
    }
  }

  @media (max-width: 768px) {
    #summary {
      grid-template-columns: 1fr;
    }
  }

  .row {
    line-height: 1.25rem;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    & > .row-label {
      color: $grey-600;
      font-weight: 400;
    }
  }

  h2 {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 28px;
    font-weight: 600;
    line-height: 2rem;
    margin-top: 0px;
  }

  .spacer {
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .hero {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .content {
    max-width: 1620px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 120px;
  }
</style>

<Seo
  title="Aleo Blockchain Explorer | AleoScan - Track Blocks & Transactions"
  description="AleoScan is a powerful Aleo blockchain explorer. Track transactions, blocks, validators, programs, and smart contracts in real-time."
/>

{#snippet height_column(value: number)}
  <Link href="/block/{value}">
    <FormattedNumber number={value} />
  </Link>
{/snippet}

<div class="background" style:--home-bg="url({home_bg})"></div>

<div class="content">
  <div class="hero">
    <div class="big-title">Explore Aleo Blockchain</div>
    <SearchBar is_index />
  </div>
  <div class="overview">
    <h2>Aleo Overview</h2>
    <div id="summary">
      {#each summary_data as column}
        {#each column as row}
          <div class="row">
            <div class="row-label">{row.name}</div>
            {#if row.kind === "number"}
              <FormattedNumber number={row.value} precision={row.precision} unit={row.unit} flash />
            {:else if row.kind === "time"}
              <Time timestamp={row.value} flash />
            {:else}
              <Epoch height={row.value} flash />
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  </div>
  <div id="blocks">
    <h2>Blocks</h2>
    <TableContainer>
      <DataTable {columns} data={table_data} />
    </TableContainer>
  </div>
</div>

<div class="spacer">
  <Button cls={ButtonLinkClass.Secondary} href="/blocks" label="See all" />
</div>
