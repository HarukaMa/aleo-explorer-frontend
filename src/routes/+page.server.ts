import type { PageServerLoad } from "./$types"
import { test } from "$lib/server/api/test"
import { error } from "@sveltejs/kit"
import { APIError } from "$lib/server/api/api"

export const load: PageServerLoad = async () => {
  try {
    const res = await test()
    console.log(res)
    return {
      data: res,
    }
  } catch (err) {
    console.error(err)
    if (err instanceof APIError) {
      return error(502, err.message)
    }
    throw err
  }
}
