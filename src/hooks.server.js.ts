import type { HandleServerError } from "@sveltejs/kit"

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  console.error(error)
  return {
    message: message || "Internal server error",
  }
}
