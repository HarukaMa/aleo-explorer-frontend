import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { API, APIError } from "$lib/server/api/api"
import "$lib/server/api/block"

export const load: PageServerLoad = async () => {
  try {
    const recent_blocks = await API.instance.recent_blocks()
    console.log(recent_blocks)
    return {
      recent_blocks: recent_blocks,
    }
  } catch (err) {
    console.error(err)
    if (err instanceof APIError) {
      return error(500, err.message)
    }
    throw err
  }
}
