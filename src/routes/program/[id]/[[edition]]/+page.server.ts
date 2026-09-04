import type { PageServerLoad } from "./$types"
import { API } from "$lib/server/api/api"
import { error, redirect } from "@sveltejs/kit"
import { app_error_from_api_error, program_url } from "$lib/utils"
import { APIError } from "$lib/types"

export const load: PageServerLoad = async ({ params, url }) => {
  const { id, edition } = params
  const context: Record<string, string> = {}
  const height = url.searchParams.get("height")
  const transaction_index = url.searchParams.get("transaction_index")
  if (height !== null) context.height = height
  if (transaction_index !== null) context.transaction_index = transaction_index
  try {
    const data = await API.instance.program(id, edition ?? null, context)
    if (edition === undefined && Object.keys(context).length > 0) {
      redirect(307, program_url(id, data.edition))
    }
    return { data }
  } catch (err) {
    console.log(err)
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
