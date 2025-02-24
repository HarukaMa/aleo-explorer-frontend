import type { HandleClientError } from "@sveltejs/kit"

export const handleError: HandleClientError = async ({ error }) => {
  console.log("client error handler")
  console.log(error)
  // @ts-expect-error unknown
  if (error.status === 404) {
    // Return a new response object
    return {
      error: "Page not found",
      message: "The page you are looking for doesn't exist or has been moved.",
    }
  }
  // Return a new response object
  return {
    error: error.text,
    message: "Unknown error",
  }
}
