import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { authConfigManager } from './utils/authjs'
import { RESTManager } from './utils/rest'

authConfigManager.setConfig({
  basePath: '/auth',
  baseUrl: RESTManager.endpoint,
  credentials: 'include',
})
declare global {
  interface JSON {
    safeParse: typeof JSON.parse
  }
}
JSON.safeParse = (...rest) => {
  try {
    return JSON.parse(...rest)
  } catch {
    return null
  }
}

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
