import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Provider as ReactReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { rootStore } from './store'

import './global.css'

import { ThemeProvider } from '~/providers/theme-provider'

import { Router } from './router'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    window.message = toast
  }, [])
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="van-ui-theme">
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ReactReduxProvider store={rootStore}>
            <Suspense fallback={<div>loading...</div>}>
              <Router />
            </Suspense>
          </ReactReduxProvider>
          <Toaster toastOptions={{}} />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
