import type { RouteObject } from 'react-router-dom'

import { AppLayout } from '~/layouts/app-layout'

export const routes: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    loader: () => ({ message: 'Hello Data Router!' }),
    Component: AppLayout,
  },
]
