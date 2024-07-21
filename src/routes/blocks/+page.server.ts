import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { APIError } from "$lib/server/api/base"

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
      return error(500, err.message)
    }
    throw err
  }
}
