import { Outlet } from 'react-router-dom'

import BaseLayout from './base-layout'
import { SidebarLayout } from './side-bar'

const AppLayout = () => {
  return (
    <BaseLayout>
      <SidebarLayout />
      <Outlet />
    </BaseLayout>
  )
}
export default AppLayout
