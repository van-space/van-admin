import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from './interface'

import { TachometerAltIcon } from '~/components/ui/icons'
import AppLayout from '~/layouts/app-layout'
import SetupLayout from '~/layouts/setup-view'
import Login from '~/pages/login'
import Setup from '~/pages/setup'
import SetupApi from '~/pages/setup-api'

import { RouteName } from './name'
import lazyLoad from './utils/LazyLoad'

export const rootRoutes: RouteObject[] = [
  // protected routes
  {
    path: '/',
    element: <AppLayout />,
    name: RouteName.Home,
    children: [
      {
        path: '/',
        index: true,
        name: RouteName.Dashboard,
        element: lazyLoad(lazy(() => import('~/pages/dashboard'))),
        meta: {
          requiresAuth: true,
          title: '仪表盘',
          key: 'dashboard',
          icon: TachometerAltIcon as any,
        },
      },
    ],
  },
  // public routes
  {
    path: '/',
    element: <SetupLayout />,
    children: [
      {
        path: '/login',
        name: RouteName.Login,
        element: <Login />,
        meta: {
          requiresAuth: false,
          title: '登录',
          key: 'login',
        },
      },
      {
        path: '/setup',
        name: RouteName.Setup,
        element: <Setup />,
        meta: {
          requiresAuth: false,
          title: '初始化',
          key: 'login',
        },
      },
      {
        path: '/setup-api',
        element: <SetupApi />,
        meta: {
          requiresAuth: false,
          title: '初始化 API',
          key: 'login',
        },
      },
    ],
  },
  {
    path: '/logout',
    element: <Navigate to={'/login'} />,
  },
  {
    path: '*',
    element: <Navigate to={'/login'} />,
  },
]
// 递归获取所有路由，包括嵌套路由
export const getAllRoutes = (routes: RouteObject[]) => {
  let allRoutes: any[] = []
  for (const route of routes) {
    if (route.path === '*' || route.path === '/logout') {
      continue
    }
    if (route.index) {
      allRoutes.push({
        path: '/',
        title: route.meta?.title ?? '',
        name: route.meta?.key,
      })
    } else {
      if (route.path !== '/') {
        allRoutes.push({
          path: route.path
            ? route.path.startsWith('/')
              ? route.path
              : `/${route.path}`
            : '',
          title: route.meta?.title ?? '',
          name: route.meta?.key,
          icon: route.meta?.icon,
        })
      }
    }

    if (route.children) {
      const childRoutes = getAllRoutes(route.children)
      allRoutes = allRoutes.concat(childRoutes)
    }
  }

  return allRoutes
}
