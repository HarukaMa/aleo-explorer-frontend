import { API } from "$lib/server/api/api"
import type { APIBaseMixin, Constructor } from "$lib/utils"

export function APIBlock<TBase extends APIBaseMixin>(Base: TBase) {
  return class extends Base {
    constructor(...args: never[]) {
      super(...args)
    }

    public async recent_blocks(this: API): Promise<object> {
      return await super.get("/block/recent")
    }
  }
}
