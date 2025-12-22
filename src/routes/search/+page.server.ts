import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import { error, redirect } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError, SearchError } from "$lib/types"

const redirectIfSingle = (items: string[], path: string) => {
  if (items.length === 1) {
    redirect(307, `/${path}/${items[0]}`)
  }
  if (items.length === 0) {
    return SearchError.NotFound
  }
}

export const load: PageServerLoad = async ({ url }) => {
  try {
    const query = url.searchParams.get("q")

    if (!query || query.length < 3) {
      return {
        query: "",
        result: {},
        error: SearchError.QueryTooShort,
      }
    }

    const result = await API.instance.search(query)
    console.log(`result`, result)
    let error: SearchError | undefined

    switch (result.type) {
      case "block":
        redirect(307, `/block/${result.height}`)
        break

      case "blocks":
        error = redirectIfSingle(result.blocks, "block")
        break

      case "transactions":
        error = redirectIfSingle(result.transactions, "transaction")
        break

      case "transitions":
        error = redirectIfSingle(result.transitions, "transition")
        break

      case "addresses":
        error = redirectIfSingle(result.addresses, "address")
        break

      case "solutions":
        error = redirectIfSingle(result.solutions, "solution")
        break

      case "ans_program":
        if (result.programs.length === 0 && result.names.length === 1) {
          redirect(307, `/ans/${result.names[0]}`)
        }
        if (result.programs.length === 1 && result.names.length === 0) {
          redirect(307, `/program/${result.programs[0]}`)
        }
        break
    }

    return {
      query,
      result,
      error,
    }
  } catch (err) {
    const query = url.searchParams.get("q")
    console.log(err)
    if (err instanceof APIError) {
      if (err.code === 404) {
        return {
          query,
          result: {},
          error: SearchError.NotFound,
        }
      } else if (err.code === 400) {
        return {
          query,
          result: {},
          error: SearchError.QueryTooShort,
        }
      } else {
        return error(err.code, app_error_from_api_error(err))
      }
    }
    throw err
  }
}
