import { Outlet } from 'react-router-dom'

import BaseLayout from './base-layout'

const AppLayout = () => {
  return (
    <BaseLayout>
      <h1>This is AppLayout</h1>
      <Outlet />
    </BaseLayout>
  )
}
export default AppLayout
