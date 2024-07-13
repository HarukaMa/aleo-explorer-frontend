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
      //letter-spacing: -0.25px;
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

  let { data } = $props()

  let summary_data = $derived([
    [
      { name: "Latest block", value: renderComponent(Number, { number: data.summary.latest_height }) },
      { name: "Block time", value: renderComponent(Time, { timestamp: data.summary.latest_timestamp }) },
      { name: "Active validators", value: data.summary.validators },
      { name: "Validator participation rate (1h)", value: (data.summary.participation_rate * 100).toFixed(2) + "%" },
    ],
    [
      {
        name: "Epoch",
        value: renderComponent(Epoch, { height: data.summary.latest_height }),
      },
      { name: "Proof target", value: renderComponent(Number, { number: data.summary.proof_target }) },
      { name: "Coinbase target", value: renderComponent(Number, { number: data.summary.coinbase_target }) },
      {
        name: "Puzzle solving rate (15m)",
        value: renderComponent(Number, { number: data.summary.network_speed, precision: 2, unit: "s/s" }),
      },
    ],
  ])

  type Block = {
    height: number,
    timestamp: number,
    transactions: number,
    proof_target: number,
    coinbase_target: number,
    block_reward: number,
    puzzle_reward: number,
    puzzle_solutions: number
  }
  $inspect(data.recent_blocks)
  const table_data: Block[] = data.recent_blocks.map((block: any) => ({
    height: block.height,
    timestamp: block.timestamp,
    transactions: block.transaction_count,
    proof_target: block.proof_target,
    coinbase_target: block.coinbase_target,
    block_reward: block.block_reward,
    puzzle_reward: Math.floor(block.coinbase_reward * 2 / 3),
    puzzle_solutions: block.partial_solution_count,
  }))

  const columns: ColumnDef<Block>[] = [
    {
      accessorKey: "height",
      header: "Height",
      cell: info => renderComponent(Link, {
        href: `/block/${info.getValue()}`,
        child_component: Number,
        number: info.getValue(),
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

  const table = createTable<Block>({
    data: table_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
</script>


<div class="background" style:--home-bg=url({home_bg})></div>

<div class="big-title">Explore Aleo Blockchain</div>

<div class="search-bar">
  <SearchBar homepage />

  <div id="summary">
    {#each summary_data as column}
      <div class="column">
        {#each column as row}
          <div class="row">
            <div>{row.name}</div>
            {#if row.value instanceof Object}
              <svelte:component this={row.value.component} {...row.value.props} />
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
</div>
