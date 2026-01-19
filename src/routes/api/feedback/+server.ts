import { json } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"

export async function POST({ request }) {
  const formData = await request.formData()

  let contact = formData.get("contact")
  const content = formData.get("content")
  const turnstileResponse = formData.get("cf-turnstile-response")

  // Validate contact - set to Anonymous if empty
  if (!contact || typeof contact !== "string" || contact.trim() === "") {
    contact = "Anonymous"
  }

  // Validate content
  if (!content || typeof content !== "string" || content.trim() === "") {
    return json({ message: "Invalid content" }, { status: 400 })
  }

  // Verify Turnstile token
  if (env.TURNSTILE_SECRET_KEY) {
    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileResponse as string,
      }),
    })

    if (!verifyResponse.ok) {
      return json({ message: "Failed to verify captcha" }, { status: 400 })
    }

    const verifyResult = await verifyResponse.json()

    if (!verifyResult.success) {
      const errorCodes = verifyResult["error-codes"]?.join(", ") || "unknown"
      return json({ message: `Failed to verify captcha: ${errorCodes}` }, { status: 400 })
    }
  }

  // Send feedback to backend API
  try {
    const response = await fetch(`${env.API_ROOT}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${env.API_TOKEN}`,
      },
      body: JSON.stringify({
        contact,
        content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return json({ message: errorData.message || "Failed to submit feedback" }, { status: response.status })
    }

    return json({ success: true })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return json({ message: "An error occurred while submitting feedback" }, { status: 500 })
  }
}
