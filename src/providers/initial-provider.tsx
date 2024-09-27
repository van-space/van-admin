import { useEffect } from 'react'
import { useMatches, useNavigation } from 'react-router-dom'
import QProgress from 'qier-progress'

import { useAttachTokenFromQuery } from '~/hooks/use-attach-token-from-query'

export const progress = new QProgress({ colorful: false, color: '#1a9cf3' })

export const InitialProvider = ({ children }) => {
  const matches = useMatches()
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

  useAttachTokenFromQuery()
  return <>{children}</>
}
