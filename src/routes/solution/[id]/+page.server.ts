import type { PageServerLoad } from "./$types"
import { API } from "$lib/server/api/api"
import { error, redirect } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params
  try {
    const height = await API.instance.solution(id)
    redirect(307, `/block/${height}`)
  } catch (err) {
    console.log(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
