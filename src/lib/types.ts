import type { Snippet } from "svelte"

export enum ButtonLinkClass {
  Primary = "primary",
  Secondary = "secondary",
  Ghost = "ghost",
  Danger = "danger",
}

export type BlockList = {
  height: number
  timestamp: number
  transactions: number
  proof_target: number
  coinbase_target: number
  block_reward: number
  puzzle_reward: number
  puzzle_solutions: number
}

export type BeforeContainerState = {
  snippet: Snippet | undefined
}

export type UIAddressDataItem = {
  name: string
  tag: string
  link: string
  logo: string
}

export type UIAddressData = { [address: string]: UIAddressDataItem }
