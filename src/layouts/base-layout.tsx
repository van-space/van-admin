import { useEffect } from 'react'
import {
  useLocation,
  useMatches,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import QProgress from 'qier-progress'

import { API_URL, GATEWAY_URL } from '~/constants/env'

export const progress = new QProgress({ colorful: false, color: '#1a9cf3' })
const BaseLayout = ({ children }) => {
  const matches = useMatches()
  const navigate = useNavigate()
  const location = useLocation()
  const navigation = useNavigation()
  const { handle, data } = matches[matches.length - 1] as any
  const title = handle && handle.title(data)
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      progress.start()
    }

    if (navigation.state === 'idle') {
      progress.finish()
    }
  }, [navigation.state])
  useEffect(() => {
    const runGuard = async () => {
      if (location.pathname === '/setup-api') return
      if (!API_URL || !GATEWAY_URL) {
        navigate('/setup-api')
        return
      }

      // Route protection for setup
      if (location.pathname === '/setup') {
        // TODO
      }
    }

    runGuard()
  }, [location, navigate])
  return (
    <>
      <h1>This is BaseLayout</h1>
      {children}
    </>
  )
}
export default BaseLayout
