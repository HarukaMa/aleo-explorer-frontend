import { API } from "$lib/server/api/api"

export async function recent_blocks(this: API): Promise<object> {
  return await this.get("/block/recent")
}

declare module "$lib/server/api/api" {
  interface API {
    recent_blocks: typeof recent_blocks
  }
}

API.prototype.recent_blocks = recent_blocks
