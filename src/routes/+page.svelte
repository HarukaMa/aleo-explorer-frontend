<style lang="scss">
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
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

  .search-bar {
    margin-top: 1.5rem;
  }

  #summary {
    margin-top: 3rem;
    display: flex;
    gap: 8rem;
    margin-right: 4rem;

    :global(.formatted-number), :global(.epoch), :global(.time) {
      font-weight: 700;
      //letter-spacing: -0.01rem;
    }
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 50%;
  }

  .row {
    display: flex;
    line-height: 1.25rem;

    > div {

      &:nth-child(1) {
        display: inline;
        width: 50%;
      }

      &:nth-child(2) {
        display: inline;
        width: 50%;
        font-weight: 700;
      }

    }
  }

  #blocks {
    margin-top: 8rem;

    header {
      font-family: "Montserrat Variable", sans-serif;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 2rem;
    }
  }

  table {
    width: 100%;
    margin-top: 2.5rem;
  }

  .spacer {
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

</style>


<script lang="ts">
  import home_bg from "$lib/assets/images/home_bg.svg"
  import SearchBar from "$lib/components/SearchBar.svelte"
  import Number from "$lib/components/Number.svelte"
  import { type ColumnDef, createTable, FlexRender, getCoreRowModel, renderComponent } from "@tanstack/svelte-table"
  import Epoch from "$lib/components/Epoch.svelte"
  import AleoCredit from "$lib/components/AleoCredit.svelte"
  import Time from "$lib/components/Time.svelte"
  import Link from "$lib/components/Link.svelte"
  import { browser } from "$app/environment"
  import ButtonLink from "$lib/components/Button.svelte"
  import { type BlockList, ButtonLinkClass } from "$lib/types"
  import Decimal from "decimal.js"
  import SnippetWrapper from "$lib/components/SnippetWrapper.svelte"

  let { data } = $props()

  let summary = $state(data.summary)
  let recent_blocks = $state(data.recent_blocks)

  console.log(summary)

  let summary_data = $derived([
    [
      { name: "Latest block", value: { component: Number, props: { number: summary.latest_height } } },
      { name: "Block time", value: { component: Time, props: { timestamp: summary.latest_timestamp } } },
      { name: "Active validators", value: { component: Number, props: { number: summary.validators } } },
      {
        name: "Validator participation rate (1h)",
        value: { component: Number, props: { number: (summary.participation_rate * 100), precision: 2, unit: "%" } },
      },
    ],
    [
      {
        name: "Epoch",
        value: { component: Epoch, props: { height: summary.latest_height } },
      },
      { name: "Proof target", value: { component: Number, props: { number: summary.proof_target } } },
      { name: "Coinbase target", value: { component: Number, props: { number: summary.coinbase_target } } },
      {
        name: "Puzzle solving rate (15m)",
        value: { component: Number, props: { number: summary.network_speed, precision: 2, unit: " s/s" } },
      },
    ],
  ])

  let table_data: BlockList[] = $derived(recent_blocks.map((block: any) => ({
    height: block.height,
    timestamp: block.timestamp,
    transactions: block.transaction_count,
    proof_target: block.proof_target,
    coinbase_target: block.coinbase_target,
    block_reward: new Decimal(block.block_reward),
    puzzle_reward: new Decimal(Math.floor(block.coinbase_reward * 2 / 3)),
    puzzle_solutions: block.partial_solution_count,
  })))

  const columns: ColumnDef<BlockList, any>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: info => renderComponent(SnippetWrapper, {
        snippet: height_column,
        value: info.getValue(),
      }),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: info => renderComponent(Time, { timestamp: info.getValue() }),
    },
    {
      accessorKey: "transactions",
      header: "Transactions",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "proof_target",
      header: "Proof target",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "coinbase_target",
      header: "Coinbase target",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
    {
      accessorKey: "block_reward",
      header: "Block reward",
      cell: info => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_reward",
      header: "Puzzle reward",
      cell: info => renderComponent(AleoCredit, { number: info.getValue() }),
    },
    {
      accessorKey: "puzzle_solutions",
      header: "Puzzle solutions",
      cell: info => renderComponent(Number, { number: info.getValue() }),
    },
  ]

  const table = createTable<BlockList>({
    get data() {
      return table_data
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (browser) {
    let requesting = false
    const interval = setInterval(async () => {
      if (requesting || document.hidden) return
      requesting = true
      const response = await fetch("/api/index_update?" + new URLSearchParams({ last_block: table_data[0].height.toString() }))
      requesting = false
      if (!response.ok) {
        console.error("Failed to fetch new data")
        return
      }
      const new_data = await response.json()
      summary = new_data.summary
      recent_blocks = new_data.recent_blocks.concat(recent_blocks).slice(0, 10)
    }, 5000)
    $effect(() => {
      return () => clearInterval(interval)
    })
  }

</script>

{#snippet height_column(value)}
  <Link href="/block/{value}">
    <Number number={value} />
  </Link>
{/snippet}

<div class="background" style:--home-bg=url({home_bg})></div>

<div class="big-title">Explore Aleo Blockchain</div>

<div class="search-bar">
  <SearchBar homepage />
</div>

<div id="summary">
  {#each summary_data as column}
    <div class="column">
      {#each column as row}
        <div class="row">
          <div>{row.name}</div>
          {#if row.value instanceof Object}
            <row.value.component {...row.value.props} />
          {:else}
            <div>{row.value}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<div id="blocks">
  <header>Blocks</header>
  <table>
    <thead>
    {#each table.getHeaderGroups() as header_group}
      <tr>
        {#each header_group.headers as header}
          <th>{header.column.columnDef.header}</th>
        {/each}
      </tr>
    {/each}
    </thead>
    <tbody>
    {#each table.getRowModel().rows as row}
      <tr>
        {#each row.getVisibleCells() as cell}
          <td>
            <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
          </td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<div class="spacer">
  <ButtonLink href="/blocks" content="See all" cls={ButtonLinkClass.Secondary} />
</div>
