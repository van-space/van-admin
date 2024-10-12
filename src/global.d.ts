declare global {
  export interface Window {
    notification: ReturnType<typeof useNotification>
    dialog: ReturnType<typeof useDialog>
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
  export type KV = Record<string, any>
}

export {}
