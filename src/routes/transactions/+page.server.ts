import type { PageServerLoad } from "./$types"
import { API } from "$lib/server/api/api"
import { error } from "@sveltejs/kit"
import { app_error_from_api_error } from "$lib/utils"
import { APIError } from "$lib/types"
import type { TransactionScope } from "$lib/server/api/chain"

export const load: PageServerLoad = async ({ url }) => {
  try {
    const page = url.searchParams.get("page") || 1
    const scope: TransactionScope = url.searchParams.get("scope") === "pending" ? "pending" : "confirmed"
    const transactions = await API.instance.transactions(scope, page)
    return {
      page,
      transactions,
    }
  } catch (err) {
    if (err instanceof APIError) {
      return error(err.code, app_error_from_api_error(err))
    }
    throw err
  }
}
