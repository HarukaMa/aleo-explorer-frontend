import { API } from "$lib/server/api/api"
import { json } from "@sveltejs/kit"

export async function GET({ url }) {
  const page = url.searchParams.get("p")
  const programs = await API.instance.programs(page)
  return json(programs)
}
