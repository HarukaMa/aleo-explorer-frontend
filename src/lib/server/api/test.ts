import { API } from "$lib/server/api/api"

export async function test() {
  const api = API.instance
  return await api.get("/")
}
