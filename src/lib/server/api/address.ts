import { API } from "$lib/server/api/api"
import type { APIBaseMixin } from "$lib/utils"

export function APIAddress<TBase extends APIBaseMixin>(Base: TBase) {
  return class extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    public async address(this: API, address: string): Promise<any> {
      return await super.get(`/address/${address}`)
    }
  }
}
