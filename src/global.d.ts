import type { toast } from 'react-hot-toast'

declare global {
  export interface Window {
    message: typeof toast
    toast: typeof toast
    injectData: {
      BASE_API: null | string
      WEB_URL: null | string
      GATEWAY: null | string
      LOGIN_BG: null | string
      TITLE: null | string
      INIT: null | boolean
      PAGE_PROXY: boolean
    }
    [K: string]: any
  }
  export const __DEV__: boolean
  export type KV = Record<string, any>
}
