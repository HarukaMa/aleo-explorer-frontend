import { API } from "$lib/server/api/api"

type SyncInfo = {
  out_of_sync: boolean
  maintenance_info: string
  explorer_height: number
  node_height: number
  reference_height: number
}

export async function sync_info(this: API): Promise<SyncInfo> {
  return await this.get("/sync")
}

declare module "$lib/server/api/api" {
  interface API {
    sync_info: typeof sync_info
  }
}

API.prototype.sync_info = sync_info
