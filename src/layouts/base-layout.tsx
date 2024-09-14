import { useMatches } from 'react-router-dom'

import { NavigationProgressBar } from '~/components/Progress'

const BaseLayout = ({ children }) => {
  const matches = useMatches()
  const { handle, data } = matches[matches.length - 1] as any
  const title = handle && handle.title(data)
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])
  return (
    <>
      <NavigationProgressBar />
      <h1>This is BaseLayout</h1>
      {children}
    </>
  )
}
export default BaseLayout
