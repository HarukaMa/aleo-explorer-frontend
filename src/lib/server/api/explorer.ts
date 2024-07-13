import { API } from "$lib/server/api/api"
import type { APIBaseMixin } from "$lib/utils"

type SyncInfo = {
  out_of_sync: boolean
  maintenance_info: string
  explorer_height: number
  node_height: number
  reference_height: number
}

export type Summary = {
  latest_height: number
  latest_timestamp: number
  proof_target: number
  coinbase_target: number
  network_speed: number
  validators: number
  participation_rate: number
}

export function APIExplorer<TBase extends APIBaseMixin>(Base: TBase) {
  return class extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    public async sync_info(this: API): Promise<SyncInfo> {
      return await super.get("/sync")
    }

    public async summary(this: API): Promise<Summary> {
      return await super.get("/summary")
    }
  }
}
