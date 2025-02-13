import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import { error, redirect } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError, SearchError } from "$lib/types"

export const load: PageServerLoad = async ({ url }) => {
  try {
    const query = url.searchParams.get("q")
    // just in case some links or the component is broken
    if (!query || query.length < 3) {
      // don't hit backend for meaningless search
      return {
        query: "",
        result: {},
        error: SearchError.QueryTooShort,
      }
    }
    const result = await API.instance.search(query)

    let error = undefined

    if (result.type === "block") {
      redirect(307, `/block/${result.height}`)
    } else if (result.type === "blocks") {
      if (result.blocks.length === 1) {
        redirect(307, `/block/${result.blocks[0]}`)
      } else if (result.blocks.length === 0) {
        error = SearchError.NotFound
      }
    } else if (result.type === "transactions") {
      if (result.transactions.length === 1) {
        redirect(307, `/transaction/${result.transactions[0]}`)
      } else if (result.transactions.length === 0) {
        error = SearchError.NotFound
      }
    } else if (result.type === "transitions") {
      if (result.transitions.length === 1) {
        redirect(307, `/transition/${result.transitions[0]}`)
      } else if (result.transitions.length === 0) {
        error = SearchError.NotFound
      }
    } else if (result.type === "addresses") {
      if (result.addresses.length === 1) {
        redirect(307, `/address/${result.addresses[0]}`)
      } else if (result.addresses.length === 0) {
        error = SearchError.NotFound
      }
    } else if (result.type === "solutions") {
      if (result.solutions.length === 1) {
        redirect(307, `/solution/${result.solutions[0]}`)
      } else if (result.solutions.length === 0) {
        error = SearchError.NotFound
      }
    } else if (result.type === "ans_program") {
      if (result.programs.length === 0 && result.names.length === 1) {
        redirect(307, `/ans/${result.names[0]}`)
      } else if (result.programs.length === 1 && result.names.length === 0) {
        redirect(307, `/program/${result.programs[0]}`)
      }
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
