import { Outlet } from 'react-router-dom'

import BaseLayout from './base-layout'
import { SidebarLayout } from './sidebar'

const AppLayout = () => {
  return (
    <BaseLayout>
      <SidebarLayout />
      <Outlet />
    </BaseLayout>
  )
}
export default AppLayout
