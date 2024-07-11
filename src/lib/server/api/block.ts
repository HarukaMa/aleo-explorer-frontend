import { API } from "$lib/server/api/api"
import type { APIBaseMixin } from "$lib/utils"

export function APIBlock<TBase extends APIBaseMixin>(Base: TBase) {
  return class extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    public async recent_blocks(this: API): Promise<object[]> {
      return await super.get("/block/recent")
    }
  }
}
