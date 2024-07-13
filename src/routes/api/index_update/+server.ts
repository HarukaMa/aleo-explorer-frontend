import { API } from "$lib/server/api/api"
import { json } from "@sveltejs/kit"

export async function GET({ url }) {
  const last_block = url.searchParams.get("last_block")
  if (last_block === null) {
    return json({}, { status: 400 })
  }

  const result = await API.instance.index_update(last_block)
  return json(result)
}
