import type { Snippet } from "svelte"
import Decimal from "decimal.js"

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
  block_reward: Decimal
  puzzle_reward: Decimal
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

export class APIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "APIError"
  }
}
