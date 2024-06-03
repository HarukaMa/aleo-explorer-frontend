import { API } from "$lib/server/api/api"

export async function sync_info(this: API) {
  return await this.get("/sync")
}

declare module "$lib/server/api/api" {
  interface API {
    sync_info: typeof sync_info
  }
}

API.prototype.sync_info = sync_info
