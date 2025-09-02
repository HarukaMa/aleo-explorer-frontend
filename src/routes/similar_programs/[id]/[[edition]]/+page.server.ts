import type { PageServerLoad } from "./$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async ({ url, params }) => {
  const page = url.searchParams.get("page") || 1
  const { id, edition } = params
  try {
    return {
      page,
      programs: await API.instance.similar_programs(id, edition || null, page),
      id,
      edition,
    }
  } catch (err) {
    console.log(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
