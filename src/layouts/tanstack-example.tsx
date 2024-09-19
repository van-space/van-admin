import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

import BaseLayout from './base-layout'

const SetupLayout = () => {
  return (
    <BaseLayout>
      <UsingFetchAPI />
      <h1>This is SetupLayout</h1>
      <Outlet />
    </BaseLayout>
  )
}

export default SetupLayout
function UsingFetchAPI() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['getUser'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
        res.json(),
      ),
  })

  if (isLoading) return 'Loading...'

  if (error) return `An error has occurred: ${error.message}`

  return <div>{JSON.stringify(data)}</div>
}
