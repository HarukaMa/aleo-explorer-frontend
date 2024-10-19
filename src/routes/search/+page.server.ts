import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError, SearchError } from "$lib/types"

export const load: PageServerLoad = async ({ url }) => {
  try {
    const query = url.searchParams.get("q")
    // just in case some links or the component is broken
    if (!query) {
      // don't hit backend for meaningless search
      return {
        query: "",
        result: {},
        error: SearchError.QueryTooShort,
      }
    }
    const result = await API.instance.search(query)

    return {
      query,
      result,
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
