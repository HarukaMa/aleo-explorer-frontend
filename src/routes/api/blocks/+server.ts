import { API } from "$lib/server/api/api"
import { json } from "@sveltejs/kit"

export async function GET({ url }) {
  const page = url.searchParams.get("p")
  const blocks = await API.instance.blocks(page)
  return json(blocks)
}
