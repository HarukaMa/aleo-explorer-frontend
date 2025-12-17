import type { Handle, HandleServerError } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname, searchParams } = event.url

  if (pathname === "/block" && searchParams.has("h")) {
    const height = searchParams.get("h")
    redirect(301, `/block/${height}`)
  }

  if (pathname === "/address" && searchParams.has("a")) {
    const address = searchParams.get("a")
    redirect(301, `/address/${address}`)
  }

  if (pathname === "/program" && searchParams.has("id")) {
    const id = searchParams.get("id")
    const edition = searchParams.get("edition") || "1"
    redirect(301, `/program/${id}/${edition}`)
  }

  if (pathname === "/transaction" && searchParams.has("id")) {
    const id = searchParams.get("id")
    redirect(301, `/transaction/${id}`)
  }

  if (pathname === "/transition" && searchParams.has("id")) {
    const id = searchParams.get("id")
    redirect(301, `/transition/${id}`)
  }

  return resolve(event)
}

export const handleError: HandleServerError = async ({ error }) => {
  console.log("server error handler")
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
    message: error.message,
  }
}
