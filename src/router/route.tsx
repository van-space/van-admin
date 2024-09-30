import { redirect } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { configs } from '~/config'
import AppLayout from '~/layouts/app-layout'
import SetupLayout from '~/layouts/setup-view'
import Dashboard from '~/pages/dashboard'
import LoginPage from '~/pages/login'

import { baseLoader, protectedLoader } from './loader'
import { RouteName } from './name'

const title = configs.title
function getPageTitle(pageTitle?: string | null) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
export const routes: RouteObject[] = [
  // protected routes
  {
    path: '/',
    id: 'app',
    Component: AppLayout,
    children: [
      {
        index: true,
        id: RouteName.Dashboard,
        Component: Dashboard,
        handle: {
          name: '工作台',
        },
      },
    ].map((route) => {
      return {
        ...route,
        handle: {
          ...route.handle,
          title: () => getPageTitle(route.handle?.name),
        },
        loader: protectedLoader,
      }
    }),
  },
  // public routes
  {
    path: '/',
    id: 'setting',
    Component: SetupLayout,
    children: [
      {
        path: 'login',
        id: RouteName.Login,
        Component: LoginPage,
        handle: {
          name: '登录',
        },
      },
      {
        path: 'setup',
        id: RouteName.Setup,
        handle: {
          name: '初始化',
        },
        async lazy() {
          const Setup = await import('~/pages/setup')
          return {
            Component: Setup.default,
          }
        },
      },
      {
        path: 'setup-api',
        id: RouteName.SetupApi,
        handle: {
          name: '初始化 API',
        },
        async lazy() {
          const SetupApi = await import('~/pages/setup-api')
          return {
            Component: SetupApi.default,
          }
        },
      },
    ].map((route) => {
      return {
        ...route,
        handle: {
          ...route.handle,
          title: () => getPageTitle(route.handle?.name),
        },
        loader: baseLoader,
      }
    }),
  },
  {
    path: '/logout',
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      return redirect('/')
    },
  },
  {
    path: '*',
    id: '404',
    loader: () => redirect('/'),
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
        title: route.handle?.name ?? '',
        name: route.id,
      })
    } else {
      if (route.id !== 'app' && route.id !== 'setting') {
        allRoutes.push({
          path: route.path
            ? route.path.startsWith('/')
              ? route.path
              : `/${route.path}`
            : '',
          title: route.handle?.name ?? '',
          name: route.id,
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
