import type { LayoutServerLoad } from "../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import "$lib/server/api/explorer"

export const load: LayoutServerLoad = async () => {
  const sync_info = await API.instance.sync_info()

  return {
    sync_info: sync_info,
  }
}
