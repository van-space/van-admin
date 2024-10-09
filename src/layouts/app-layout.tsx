import { Outlet } from 'react-router-dom'

// import { SidebarLayout } from './sidebar'

const AppLayout = () => {
  return (
    <div>
      {/* <SidebarLayout /> */}
      <Outlet />
    </div>
  )
}
export default AppLayout
