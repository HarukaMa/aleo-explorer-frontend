<script lang="ts">
  import Seo from "$lib/components/Seo.svelte"
  import PageHeader from "$lib/components/PageHeader.svelte"
  import Button from "$lib/components/Button.svelte"
  import { ButtonLinkClass } from "$lib/types"
  import { env } from "$env/dynamic/public"
  import { onMount } from "svelte"
  import { page } from "$app/state"

  let contact = $state("")
  let content = $state("")
  let isSubmitting = $state(false)
  let errorMessage = $state("")

  // Check URL params for success/message
  let success = $derived(page.url.searchParams.get("success") === "1")
  let urlMessage = $derived(page.url.searchParams.get("message"))

  onMount(() => {
    // Load Turnstile widget
    setTimeout(() => {
      if ((window as any).turnstile && env.PUBLIC_TURNSTILE_SITE_KEY) {
        ;(window as any).turnstile.render("#cf-turnstile", {
          sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
        })
      }
    }, 1000)
  })

  let form: HTMLFormElement | undefined

  async function handleSubmit(event: Event) {
    event.preventDefault()

    if (!content.trim()) {
      errorMessage = "Please enter your feedback"
      return
    }

    isSubmitting = true
    errorMessage = ""

    const formData = new FormData(form)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Redirect to success page
        window.location.href = "/feedback?success=1"
      } else {
        const data = await response.json()
        errorMessage = "Failed to submit feedback. Please try again: " + data.message
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again."
    } finally {
      isSubmitting = false
    }
  }
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .container {
    max-width: 1620px;
    margin: 0 auto;
    display: flex;
    gap: 2.5rem;
  }

  .content,
  svg {
    margin-top: 2.5rem;
    max-width: 790px;
  }

  .section-title {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 0 !important;
  }

  .section-description {
    font-size: 0.875rem;
    line-height: 1;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
  }

  .callout {
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 2.5rem;

    &.warning {
      background-color: $yellow-50;
      display: flex;
      flex-wrap: nowrap;
      gap: 0.75rem;
      align-items: flex-start;
    }

    &.success {
      background-color: $green-50;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    &.alert {
      background-color: $red-50;
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    p {
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }
  }

  .warning-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background-color: $yellow-600;
    mask-image: $alert-icon;
    background-repeat: no-repeat;
  }

  .success-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background-color: $green-500;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
  }

  .alert-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background-color: $red-500;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E");
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .label {
    margin-bottom: 0.5rem;
    display: block;
  }

  .input {
    width: 100%;
    height: 40px;
    padding: 0.75rem 1rem;
    border: 1px solid $grey-200;
    border-radius: 0.5rem;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $blue-500;
    }

    &::placeholder {
      color: $grey-400;
    }
  }

  .textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid $grey-200;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.2s;
    resize: vertical;
    min-height: 120px;

    &:focus {
      outline: none;
      border-color: $blue-500;
    }

    &::placeholder {
      color: $grey-400;
    }
  }

  .turnstile-wrapper {
    margin-bottom: 1.5rem;
    height: 65px;
  }

  .success-card {
    display: flex;
    width: 100%;
    min-height: 490px;
    justify-content: center;
    padding: 2.5rem 0;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    border-radius: 1rem;
    border: 1px solid $grey-100;
  }

  .success-card-icon-container {
    display: flex;
    padding: 2rem;
    justify-content: center;
    align-items: center;
    border-radius: 6.25rem;
    background-color: $grey-25;
  }

  .success-card-icon {
    width: 2.5rem;
    height: 2.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='m9 12 2 2 4-4'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .success-card-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
  }

  .success-card-title {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .success-card-description {
    line-height: 1.25rem;
    text-align: center;
  }

  @media (max-width: 767px) {
    .background-image {
      display: none;
    }
  }
</style>

<svelte:head>
  <script defer src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
</svelte:head>

<Seo title="Feedback | AleoScan" description="Submit feedback to help us improve AleoScan." />

<PageHeader content="Feedback" />

<div class="container">
  <div class="content">
    {#if success}
      <div class="success-card">
        <div class="success-card-icon-container">
          <div class="success-card-icon"></div>
        </div>
        <div class="success-card-text">
          <div class="success-card-title">Feedback received</div>
          <div class="success-card-description">Thank you for helping us improve AleoScan.</div>
        </div>
      </div>
    {:else}
      <h2 class="section-title">Help us improve AleoScan</h2>
      <p class="section-description">
        Your feedback helps us make the explorer better. Tell us what feels confusing, broken, or could work better.
      </p>

      {#if urlMessage}
        <div class="callout alert">
          <div class="alert-icon"></div>
          <p>{urlMessage}</p>
        </div>
      {/if}

      {#if errorMessage}
        <div class="callout alert">
          <div class="alert-icon"></div>
          <p>{errorMessage}</p>
        </div>
      {/if}

      <div class="callout warning">
        <div class="warning-icon"></div>
        <p>
          AleoScan does NOT provide support for wallets or exchanges. Requests related to them will not receive a
          response.
        </p>
      </div>

      <form onsubmit={handleSubmit} bind:this={form}>
        <div class="form-group">
          <label class="label" for="contact">Email</label>
          <input
            class="input"
            type="text"
            id="contact"
            name="contact"
            bind:value={contact}
            placeholder="you@example.com"
          />
        </div>

        <div class="form-group">
          <label class="label" for="content">Feedback</label>
          <textarea
            class="textarea"
            id="content"
            name="content"
            bind:value={content}
            placeholder="Describe the issue, suggestion, or improvement you'd like to share."
          ></textarea>
        </div>

        <div class="turnstile-wrapper">
          <div id="cf-turnstile"></div>
        </div>

        <Button
          cls={ButtonLinkClass.Primary}
          Content={isSubmitting ? "Submitting..." : "Submit feedback"}
          disabled={isSubmitting}
          action={handleSubmit}
        />
      </form>
    {/if}
  </div>
  <svg width="790" class="background-image" height="495" viewBox="0 0 790 495" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_7424_19769)">
      <rect width="790" height="494.781" fill="white"></rect>
      <path opacity="0.05" d="M268.672 -293.57L-134.894 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M314.356 -293.57L-93.4141 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M675.642 -293.57L267.872 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M362.143 -293.57L-47.729 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M723.429 -293.57L313.557 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M407.835 -293.57L0.0644531 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M769.121 -293.57L361.351 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M449.315 -293.57L45.749 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M810.601 -293.57L407.035 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M494.999 -293.57L87.229 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M856.285 -293.57L448.515 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M540.684 -293.57L132.914 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M90.1241 -293.57L-317.646 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M901.97 -293.57L494.2 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M588.471 -293.57L178.599 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M137.911 -293.57L-271.961 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M949.757 -293.57L539.885 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M629.958 -293.57L226.392 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M179.399 -293.57L-224.167 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M991.244 -293.57L587.678 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M227.185 -293.57L-182.688 930.188" stroke="black" stroke-width="2"></path>
      <path opacity="0.05" d="M1039.03 -293.57L629.158 930.188" stroke="black" stroke-width="2"></path>
    </g>
    <defs>
      <clipPath id="clip0_7424_19769">
        <rect width="790" height="494.781" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
</div>
