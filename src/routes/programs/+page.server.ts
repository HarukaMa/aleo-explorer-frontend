import type { PageServerLoad } from "./$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async ({ url }) => {
  try {
    const page = url.searchParams.get("page") || 1
    const programs = await API.instance.programs(page)
    return {
      page,
      programs,
    }
  } catch (err) {
    console.log(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
