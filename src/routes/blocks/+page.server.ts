import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async ({ url }) => {
  try {
    const page = url.searchParams.get("page") || 1
    const blocks = await API.instance.blocks(page)
    return {
      page,
      blocks,
    }
  } catch (err) {
    console.log(err)
    if (err instanceof APIError) {
      return error(500, app_error_from_api_error(err))
    }
    throw err
  }
}
