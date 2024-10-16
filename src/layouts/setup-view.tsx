import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { bgUrl } from '~/constants/env'
import { cn } from '~/utils'

const SetupLayout = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const $$ = new Image()
    $$.src = bgUrl
    const handler = () => {
      setLoaded(true)
    }
    $$.addEventListener('load', handler)
    return () => {
      $$.removeEventListener('load', handler)
    }
  })
  return (
    <>
      <div
        className={cn([
          'fixed bottom-0 left-0 right-0 top-0 -z-1',
          '-m-4 bg-gray-600 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-700 ease-linear',
        ])}
        style={{ backgroundImage: `url(${bgUrl})`, opacity: loaded ? 1 : 0.4 }}
      />
      <Outlet />
    </>
  )
}

export default SetupLayout
