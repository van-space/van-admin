import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

import { fetchUser } from '~/store/slice/user.slice'

import { SidebarLayout } from './sidebar'

const AppLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch<any>(fetchUser()).then(() => {
      const toSetting = localStorage.getItem('to-setting')
      if (toSetting === 'true') {
        navigate('/setting')
        localStorage.removeItem('to-setting')
      }
    })
  }, [dispatch, navigate])

  return (
    <div>
      <SidebarLayout />
      <Outlet />
    </div>
  )
}
export default AppLayout
