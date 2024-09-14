import { Outlet } from 'react-router-dom'

import BaseLayout from './base-layout'

const SetupLayout = () => {
  return (
    <BaseLayout>
      <h1>This is SetupLayout</h1>
      <Outlet />
    </BaseLayout>
  )
}

export default SetupLayout
