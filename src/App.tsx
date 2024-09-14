import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import './App.css'

import { router } from './router'

export default function App() {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
