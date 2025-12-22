import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { API } from "$lib/server/api/api"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async () => {
  try {
    const summary = await API.instance.summary()
    return {
      proof_target: summary.proof_target,
      // TODO: fetch real data
      avg_reward: 839921,
    }
  } catch (err) {
    console.error(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
