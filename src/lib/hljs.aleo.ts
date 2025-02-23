// minimal placeholder
import type { LanguageType } from "svelte-rune-highlight/languages"

const aleo: LanguageType<string> = {
  name: "aleo",
  register: function (hljs: any) {
    return {
      contains: [],
    }
  },
}
export default aleo
