import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { API } from "$lib/server/api/api"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async () => {
  try {
    const [recent_blocks, summary] = await Promise.all([API.instance.recent_blocks(), API.instance.summary()])
    return {
      recent_blocks: recent_blocks,
      summary: summary,
    }
  } catch (err) {
    console.error(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
