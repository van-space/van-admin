import { useRoutes } from 'react-router-dom'

import { rootRoutes } from './route'

export const Router = () => {
  const routes = useRoutes(rootRoutes)
  return routes
}
