<script lang="ts">
  import { onMount } from "svelte"
  import { decode as decode_jxl } from "@jsquash/jxl"
  import { encode as encode_png } from "@jsquash/png"

  let { alt, src }: { alt: string; src: string } = $props()

  let img: HTMLImageElement

  onMount(async () => {
    const response = await fetch(src)
    const buffer = await response.arrayBuffer()
    const jxl = new Uint8Array(buffer)
    const png = await encode_png(await decode_jxl(jxl))
    const blob = new Blob([png], { type: "image/png" })
    img.src = URL.createObjectURL(blob)
  })
</script>

<style lang="scss">
</style>

<img {alt} bind:this={img} {src} />
