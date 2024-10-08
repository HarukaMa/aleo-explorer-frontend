import { APIExplorer } from "$lib/server/api/explorer"
import { APIChain } from "$lib/server/api/chain"
import { APIBase } from "$lib/server/api/base"
import { APIAddress } from "$lib/server/api/address"

const mixin = APIExplorer(APIAddress(APIChain(APIBase)))

export class API extends mixin {
  private static _instance: API

  public static get instance() {
    if (!this._instance) {
      this._instance = new API()
    }
    return this._instance
  }
}
