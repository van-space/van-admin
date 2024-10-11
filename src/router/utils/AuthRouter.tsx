import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

import { configs } from '~/config'
import { API_URL, GATEWAY_URL } from '~/constants/env'
import { SESSION_WITH_LOGIN } from '~/constants/keys'
import { useAttachTokenFromQuery } from '~/hooks/use-attach-token-from-query'
import { getTokenIsUpstream } from '~/store/slice/user.slice'
import { removeToken, setToken } from '~/utils/auth'
import { checkIsInit } from '~/utils/is-init'
import { RESTManager } from '~/utils/rest'
import { searchRoute } from '~/utils/route'

import { rootRoutes } from '../route'

const title = configs.title

const AuthRouter = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lastCheckedLogAt = useRef(0)
  const loginWithTokenOnce = useRef(false)
  const route = searchRoute(pathname, rootRoutes)

  useAttachTokenFromQuery()
  useEffect(() => {
    document.title = getPageTitle(route.meta?.title)
  }, [route])
  useEffect(() => {
    if (pathname === '/setup-api') return
    if (!API_URL || !GATEWAY_URL) {
      console.log(
        'missing api url or gateway url',
        API_URL,
        GATEWAY_URL,
        ', redirect to /setup-api',
      )
      navigate('/setup-api', { replace: true })
    }
    if (pathname === '/setup') {
      checkIsInit().then((isInit) => {
        if (isInit) {
          navigate('/', { replace: true })
        }
      })
    }
    // * 判断当前路由是否需要访问权限(不需要权限直接放行)

    if (
      (route && route.meta && !route.meta?.requiresAuth) ||
      pathname.startsWith('/dev')
    )
      return

    const now = Date.now()
    if (now - lastCheckedLogAt.current < 1000 * 60 * 5) return

    const checkLogged = async () => {
      const { ok } = await RESTManager.api('master')('check_logged').get<{
        ok: number
      }>()
      if (!ok) {
        const params = new URLSearchParams()
        params.set('from', pathname)
        navigate(`/login?${params.toString()}`, { replace: true })
      }
      lastCheckedLogAt.current = now
      // TODO 这里初始化ws

      const sessionWithLogin = sessionStorage.getItem(SESSION_WITH_LOGIN)

      if (sessionWithLogin) return

      if (loginWithTokenOnce.current || getTokenIsUpstream()) return

      await RESTManager.api.master.login
        .put<{ token: string }>()
        .then((res) => {
          loginWithTokenOnce.current = true
          removeToken()
          setToken(res.token)

          // TODO 这里初始化ws
        })
        .catch(() => {
          console.log('登陆失败')
          location.reload()
        })
    }

    checkLogged()
  }, [pathname, navigate, route])

  return children
}
function getPageTitle(pageTitle?: string | null) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

export default AuthRouter
