import QProgress from 'qier-progress'

import { useAttachTokenFromQuery } from '~/hooks/use-attach-token-from-query'

export const progress = new QProgress({ colorful: false, color: '#1a9cf3' })

export const InitialProvider = ({ children }) => {
  useAttachTokenFromQuery()

  return <>{children}</>
}
