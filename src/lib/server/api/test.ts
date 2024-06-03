import { API } from "$lib/server/api/api"

export async function test(this: API) {
  return await this.get("/")
}

declare module "$lib/server/api/api" {
  interface API {
    test: typeof test
  }
}

API.prototype.test = test
