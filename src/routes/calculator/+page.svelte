<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import Button from "$lib/components/Button.svelte"
  import { ButtonLinkClass } from "$lib/types"
  import Decimal from "decimal.js"
  import PageInformation from "$lib/components/PageInformation.svelte"
  import Callout from "$lib/components/Callout.svelte"

  let { data } = $props()

  let proof_target = $state(data.proof_target.toString())
  let solution_rate = $state("")
  let avg_reward = data.avg_reward

  let result = $state<{
    days: number
    hours: number
    minutes: number
    seconds: number
    credits: Decimal
  } | null>(null)

  let error_message = $state("")

  function calculate() {
    error_message = ""
    result = null

    const ps = parseFloat(solution_rate)
    const pt = parseInt(proof_target)

    if (isNaN(ps) || ps <= 0) {
      error_message = "Please enter a valid prover solution rate"
      return
    }

    if (isNaN(pt) || pt < 134217728) {
      error_message = "Proof target must be at least 134217728 (network minimum)"
      return
    }

    // Calculate average time to find a solution (in seconds)
    const avg_seconds = pt / ps

    // Convert to days, hours, minutes, seconds
    const days = Math.floor(avg_seconds / 86400)
    const hours = Math.floor((avg_seconds - days * 86400) / 3600)
    const minutes = Math.floor((avg_seconds - days * 86400 - hours * 3600) / 60)
    const seconds = Math.floor(avg_seconds % 60)

    // Calculate average credits per solution
    // avg_reward is in microcredits, convert to ALEO
    const credits = new Decimal(avg_reward).div(1000000)

    result = { days, hours, minutes, seconds, credits }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      calculate()
    }
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .container {
    max-width: 1140px;
    margin: 0 auto;
  }

  .calculator-content {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    gap: 5rem;
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 2.5rem;
    }
  }

  .form-section {
    flex: 1;
    max-width: 600px;
  }

  .disclaimer {
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        margin-top: 0;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .label {
    margin-bottom: 0.5rem;
    display: block;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid $grey-200;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: "Inconsolata Variable", monospace;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $blue-500;
    }

    &.with-suffix {
      padding-right: 3rem;
    }
  }

  .input-suffix {
    position: absolute;
    right: 1rem;
    color: $grey-400;
    font-size: 1rem;
  }

  .helper-text {
    color: $grey-400;
    font-size: 0.75rem;
    margin-top: 0.5rem;
    line-height: 1.4;
  }

  .error-message {
    color: $red-500;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .results-section {
    flex: 1;
    max-width: 500px;
  }

  .results-card {
    border: 1px solid $grey-200;
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .results-title {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .result-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid $grey-100;

    &:last-of-type {
      border-bottom: none;
    }
  }

  .result-label {
    color: $grey-600;
    font-size: 0.875rem;
    width: 10rem;
  }

  .result-value {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .time-unit {
    display: inline-flex;
    align-items: baseline;
    .number {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .unit {
      font-size: 0.875rem;
      color: $grey-600;
      margin-left: 0.125rem;
    }
  }

  .credits-value {
    color: $green-500;
    font-size: 1.125rem;
  }

  .credits-suffix {
    color: $grey-400;
    font-size: 1.125rem;
    font-weight: normal;
  }

  .warning-box {
    background-color: $yellow-50;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: nowrap;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .warning-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background-color: $yellow-600;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z'/%3E%3C/svg%3E");
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
  }

  .warning-text {
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }

  .info-footer {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid $grey-100;
    border-radius: 1rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .info-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%239e9e9e' d='M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2zm8 2h2v2h-2V7zm0 4h2v6h-2v-6z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .info-content {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .info-title {
    font-weight: 600;
    margin-right: 0.25rem;
  }

  .placeholder {
    color: $grey-300;
    font-style: italic;
  }

  .callout-wrapper {
    :global(.callout) {
      border: none;
    }
  }

  .time-values {
    gap: 0.5rem;
  }
</style>

<Seo
  title="Proving Calculator | AleoScan"
  description="Calculate the average time and credits for finding a solution based on your prover's solution rate and the current network difficulty."
/>

<div class="header">
  <PageHeader content="Proving Calculator" />
</div>

<div class="container calculator-content">
  <div class="form-section">
    <p class="disclaimer">
      Please note that the network difficulty is constantly changing, so the results are approximate and cannot be used
      as a prediction for earnings.
    </p>

    <div class="form-group">
      <label class="label" for="proof_target">Proof Target</label>
      <div class="input-wrapper">
        <input class="input" type="text" id="proof_target" bind:value={proof_target} onkeydown={handleKeydown} />
      </div>
      <p class="helper-text">Set the target difficulty level for which the prover should aim to find a solution.</p>
    </div>

    <div class="form-group">
      <label class="label" for="solution_rate">Prover Solution Rate</label>
      <div class="input-wrapper">
        <input
          class="input with-suffix"
          type="text"
          id="solution_rate"
          bind:value={solution_rate}
          placeholder=""
          onkeydown={handleKeydown}
        />
        <span class="input-suffix">s/s</span>
      </div>
      <p class="helper-text">
        Enter the solution rate of your prover in solutions per second (s/s). This is the speed at which your prover is
        capable of processing.
      </p>
    </div>

    {#if error_message}
      <p class="error-message">{error_message}</p>
    {/if}

    <Button cls={ButtonLinkClass.Primary} Content="Calculate Time and Credits" action={calculate} />
  </div>

  <div class="results-section">
    <div class="results-card">
      <div class="results-title">Results</div>

      {#if result}
        <div class="result-row">
          <span class="result-label">Average Time</span>
          <span class="result-value time-values">
            <span class="time-unit">
              <span class="number">{result.days}</span><span class="unit">d</span>
            </span>
            <span class="time-unit">
              <span class="number">{String(result.hours).padStart(2, "0")}</span><span class="unit">h</span>
            </span>
            <span class="time-unit">
              <span class="number">{String(result.minutes).padStart(2, "0")}</span><span class="unit">m</span>
            </span>
            <span class="time-unit">
              <span class="number">{String(result.seconds).padStart(2, "0")}</span><span class="unit">s</span>
            </span>
          </span>
        </div>

        <div class="result-row">
          <span class="result-label">Average Credits</span>
          <span class="result-value">
            <span class="credits-value">{result.credits.toFixed(6)}</span>
            <span class="credits-suffix">ALEO</span>
          </span>
        </div>

        <div class="warning-box">
          <div class="warning-icon"></div>
          <p class="warning-text">
            Please note that the network difficulty is constantly changing, so the results are approximate and cannot be
            used as a prediction for earnings.
          </p>
        </div>
      {:else}
<div class="callout-wrapper">
          <Callout
            title="Waiting for input"
            description="Enter both fields and run the calculation to see results."
            icon="calculator-icon"
          />
        </div>
      {/if}
    </div>
  </div>
</div>

<div class="container">
  <PageInformation
    title="Proving Calculator"
    description="This calculator provides an estimation of how long it might take for your prover to find a solution based on the current network difficulty."
    icon="calculator-icon"
  />
</div>
