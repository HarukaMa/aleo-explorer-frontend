import { API_ROOT, API_TOKEN } from "$env/static/private"

export class APIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "APIError"
  }
}

export class API {
  private static _instance: API

  private readonly api_root: string
  private readonly api_token: string

  private constructor() {
    this.api_root = API_ROOT
    this.api_token = API_TOKEN
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new API()
    }
    return this._instance
  }

  public async request(
    method: "GET" | "POST",
    path: string,
    params?: Record<string, string>,
    body?: Record<string, unknown>,
  ) {
    const url = new URL(this.api_root + path)
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))
    }
    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.api_token}`,
          "User-Agent": "Aleoscan/0.0 (+https://aleoscan.io)",
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      if (response.ok) {
        return await response.json()
      } else {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Upstream API request failed: ${response.status} ${response.statusText}`)
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new APIError(`Cannot connect to upstream API server: ${e.message}`)
      }
      throw new APIError(`Unknown error: ${e}`)
    }
  }

  public async get(path: string, params?: Record<string, string>) {
    return this.request("GET", path, params)
  }

  public async post(path: string, body: Record<string, unknown>) {
    return this.request("POST", path, undefined, body)
  }
}
