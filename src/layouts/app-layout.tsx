import { Outlet, useLoaderData } from 'react-router-dom'

export const AppLayout = () => {
  const { message } = useLoaderData() as { message: string }
  return (
    <div>
      <h1>AppLayout</h1>
      <h2>{message}</h2>
      {<Outlet />}
    </div>
  )
}
