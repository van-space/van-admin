import { useRoutes } from 'react-router-dom'
import type { IndexRouteObject } from 'react-router-dom'

import { rootRoutes } from './route'

export const Router = () => {
  const routes = useRoutes(rootRoutes as IndexRouteObject[])
  return routes
}
