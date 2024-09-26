import { redirect } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'

import { API_URL, GATEWAY_URL } from '~/constants/env'
import { SESSION_WITH_LOGIN } from '~/constants/keys'
import { getTokenIsUpstream } from '~/store/slice/user.slice'
import { removeToken, setToken } from '~/utils/auth'
import { RESTManager } from '~/utils/rest'

let lastCheckedLogAt = 0
let loginWithTokenOnce = false

export async function protectedLoader({ request }: LoaderFunctionArgs) {
  const path = new URL(request.url).pathname
  if (path === '/setup-api') {
    return null
  }
  if (!API_URL || !GATEWAY_URL) {
    console.log(
      'missing api url or gateway url',
      API_URL,
      GATEWAY_URL,
      ', redirect to /setup-api',
    )
    return redirect('/setup-api')
  }
  // guard for setup route

  if (path === '/setup') {
    // TODO const isInit = await checkIsInit()
    const isInit = false
    console.log('[isInit]', isInit)
    if (isInit) {
      return redirect('/')
    }
  }
  if (path.startsWith('/dev')) {
    return null
  }

  const now = Date.now()
  if (now - lastCheckedLogAt < 1000 * 60 * 5) {
    return null
  }
  // 携带token 检查是否登录
  const { ok } = await RESTManager.api('master')('check_logged').get<{
    ok: number
  }>()
  if (!ok) {
    const params = new URLSearchParams()
    params.set('from', new URL(request.url).pathname)
    return redirect(`/login?${params.toString()}`)
  }
  lastCheckedLogAt = now

  // TODO 这里初始化ws

  const sessionWithLogin = sessionStorage.getItem(SESSION_WITH_LOGIN)
  if (sessionWithLogin) return null
  // login with token only
  if (loginWithTokenOnce || getTokenIsUpstream()) {
    return null
  }
  await RESTManager.api.master.login
    .put<{ token: string }>()
    .then((res) => {
      loginWithTokenOnce = true
      removeToken()
      setToken(res.token)

      // TODO 这里初始化ws
    })
    .catch(() => {
      console.log('登陆失败')
      location.reload()
    })

  return null
}

export async function baseLoader({ request }: LoaderFunctionArgs) {
  const path = new URL(request.url).pathname
  if (path === '/setup-api') {
    return null
  }
  if (!API_URL || !GATEWAY_URL) {
    console.log(
      'missing api url or gateway url',
      API_URL,
      GATEWAY_URL,
      ', redirect to /setup-api',
    )
    return redirect('/setup-api')
  }
  // guard for setup route

  if (path === '/setup') {
    // TODO const isInit = await checkIsInit()
    const isInit = false
    console.log('[isInit]', isInit)
    if (isInit) {
      return redirect('/')
    }
  }

  return null
}
