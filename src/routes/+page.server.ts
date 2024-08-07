import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { API } from "$lib/server/api/api"
import "$lib/server/api/block"
import { APIError } from "$lib/server/api/base"

export const load: PageServerLoad = async () => {
  try {
    const recent_blocks = await API.instance.recent_blocks()
    const summary = await API.instance.summary()
    return {
      recent_blocks: recent_blocks,
      summary: summary,
    }
  } catch (err) {
    console.error(err)
    if (err instanceof APIError) {
      return error(500, err.message)
    }
    throw err
  }
}
