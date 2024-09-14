import { useNavigation } from 'react-router-dom'
import QProgress from 'qier-progress'

export const progress = new QProgress({ colorful: false, color: '#1a9cf3' })
export function NavigationProgressBar() {
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      progress.start()
    }

    if (navigation.state === 'idle') {
      progress.finish()
    }
  }, [navigation.state])

  return null
}
