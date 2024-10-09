import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from './interface'

import AppLayout from '~/layouts/app-layout'
import SetupLayout from '~/layouts/setup-view'

import lazyLoad from './utils/LazyLoad'

export const rootRoutes: RouteObject[] = [
  // protected routes
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: lazyLoad(lazy(() => import('~/pages/dashboard'))),
        meta: {
          requiresAuth: true,
          title: '面板',
          key: 'dashboard',
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
        element: lazyLoad(lazy(() => import('~/pages/login'))),
        meta: {
          requiresAuth: false,
          title: '登录',
          key: 'login',
        },
      },
      {
        path: '/setup',
        element: lazyLoad(lazy(() => import('~/pages/setup'))),
        meta: {
          requiresAuth: false,
          title: '初始化',
          key: 'login',
        },
      },
      {
        path: '/setup-api',
        element: lazyLoad(lazy(() => import('~/pages/setup-api'))),
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
export const getAllRoutes = () => {}
