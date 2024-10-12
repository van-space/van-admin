import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Provider as ReactReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { rootStore } from './store'

import './global.css'

import LayoutProvider from '~/providers/layout-provider'
import { ThemeProvider } from '~/providers/theme-provider'

import { Router } from './router'
import AuthRouter from './router/utils/AuthRouter'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    window.message = toast
  }, [])
  return (
    <ThemeProvider defaultTheme="light" storageKey="van-ui-theme">
      <BrowserRouter>
        <ReactReduxProvider store={rootStore}>
          <LayoutProvider>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <AuthRouter>
                <Router />
              </AuthRouter>
              <Toaster toastOptions={{}} />
            </QueryClientProvider>
          </LayoutProvider>
        </ReactReduxProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
