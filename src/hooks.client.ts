import type { HandleClientError } from "@sveltejs/kit"

export const handleError: HandleClientError = ({ status, message }) => {
  if (status === 404) {
    return {
      error: "Page not found",
      message: "The page you are looking for doesn't exist or has been moved.",
    }
  }

  return {
    error: message,
    message: "An unexpected error occurred.",
  }
}
