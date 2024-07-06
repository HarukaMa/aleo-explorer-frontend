import { API } from "$lib/server/api/api"

type SyncInfo = {
  out_of_sync: boolean
  maintenance_info: string
  explorer_height: number
  node_height: number
  reference_height: number
}

type Summary = {
  latest_height: number
  latest_timestamp: number
  proof_target: bigint
  coinbase_target: bigint
  network_speed: number
  validators: number
  participation_rate: number
}

export async function sync_info(this: API): Promise<SyncInfo> {
  return await this.get("/sync")
}

export async function summary(this: API): Promise<Summary> {
  return await this.get("/summary")
}

declare module "$lib/server/api/api" {
  interface API {
    sync_info: typeof sync_info
    summary: typeof summary
  }
}

API.prototype.sync_info = sync_info
API.prototype.summary = summary
