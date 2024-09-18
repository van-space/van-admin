import { useNavigate } from 'react-router-dom'

import { removeToken } from '~/utils/auth'
import { RESTManager } from '~/utils/rest'

const Dashboard = () => {
  const navigate = useNavigate()
  const logout = async () => {
    await RESTManager.api.user.logout.post({})
    removeToken()
    navigate('/login')
  }
  return (
    <>
      <h1>Dashboard</h1>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </>
  )
}

export default Dashboard
