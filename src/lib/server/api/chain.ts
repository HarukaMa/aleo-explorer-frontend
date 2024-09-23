import { API } from "$lib/server/api/api"
import type { APIBaseMixin } from "$lib/utils"
import type { Summary } from "$lib/server/api/explorer"

type IndexUpdate = {
  summary: Summary
  recent_blocks: object[]
}

type Blocks = {
  blocks: object[]
  total_blocks: number
  total_pages: number
}

export function APIChain<TBase extends APIBaseMixin>(Base: TBase) {
  return class extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    public async recent_blocks(this: API): Promise<object[]> {
      return await super.get("/block/recent")
    }

    public async index_update(this: API, last_block: string): Promise<IndexUpdate> {
      return await super.get("/block/index_update", { last_block: last_block })
    }

    public async blocks(this: API, page: string | number | null): Promise<Blocks> {
      let params
      if (page) {
        params = { p: page.toString() }
      } else {
        params = {}
      }
      return await super.get("/blocks", params)
    }

    public async block(this: API, height: string | number): Promise<any> {
      return await super.get(`/block/${height}`)
    }

    public async validators(this: API, page: string | number | null): Promise<any> {
      let params
      if (page) {
        params = { p: page.toString() }
      } else {
        params = {}
      }
      return await super.get("/validators", params)
    }

    public async transaction(this: API, id: string): Promise<any> {
      return await super.get(`/transaction/${id}`)
    }

    public async transition(this: API, id: string): Promise<any> {
      return await super.get(`/transition/${id}`)
    }
  }
}
