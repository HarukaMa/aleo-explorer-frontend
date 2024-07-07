import type { LayoutServerLoad } from "../../.svelte-kit/types/src/routes/$types"
import { API } from "$lib/server/api/api"
import "$lib/server/api/explorer"

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sync_info = await API.instance.sync_info()
  const plausible_opt_out = cookies.get("plausible_opt_out")
  const time_display = cookies.get("time_display")
  return {
    sync_info: sync_info,
    plausible_opt_out: plausible_opt_out,
    time_display: time_display,
  }
}
