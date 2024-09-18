import { redirect } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { configs } from '~/config'
import AppLayout from '~/layouts/app-layout'
import SetupLayout from '~/layouts/setup-layout'
import Dashboard from '~/pages/dashboard'
import LoginPage from '~/pages/login'

import { loginAction } from './action'
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
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        id: RouteName.Dashboard,
        loader: protectedLoader,
        Component: Dashboard,
        handle: {
          title: () => getPageTitle('工作台'),
        },
      },
    ],
  },
  {
    path: '/',
    Component: SetupLayout,
    children: [
      {
        path: 'login',
        id: RouteName.Login,
        action: loginAction,
        loader: baseLoader, // or use buildLoader([loginLoader])
        Component: LoginPage,
        handle: {
          title: () => getPageTitle('登录'),
        },
      },
      {
        path: 'setup',
        handle: {
          title: () => getPageTitle('初始化'),
        },
        loader: baseLoader,
        async lazy() {
          const Setup = await import('~/pages/setup')
          return {
            Component: Setup.default,
          }
        },
      },
      {
        path: 'setup-api',
        handle: {
          title: () => getPageTitle('初始化'),
        },
        loader: baseLoader,
        async lazy() {
          const SetupApi = await import('~/pages/setup-api')
          return {
            Component: SetupApi.default,
          }
        },
      },
    ],
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
