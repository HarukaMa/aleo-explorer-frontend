import { API } from "$lib/server/api/api"
import { json } from "@sveltejs/kit"

export async function GET({ url, params }) {
  const page = url.searchParams.get("p")
  const { id, edition } = params
  return json(await API.instance.similar_programs(id, edition || null, page))
}
