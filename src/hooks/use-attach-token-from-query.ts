import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { setTokenIsUpstream } from '~/store/slice/user.slice'
import { setToken } from '~/utils/auth'

export const useAttachTokenFromQuery = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (token) {
      setToken(token)
      setTokenIsUpstream(true)

      setTimeout(() => {
        const parsedUrl = new URL(window.location.href)
        parsedUrl.searchParams.delete('token')
        navigate(parsedUrl)
      })
    } else {
      // hash mode

      const hash = window.location.hash.slice(1)

      const parsedUrl = new URL(hash, window.location.origin)
      const token = parsedUrl.searchParams.get('token')
      if (token) {
        setToken(token)
        setTokenIsUpstream(true)
        parsedUrl.searchParams.delete('token')

        navigate(parsedUrl.toString())
      }
    }
  }, [])
}
