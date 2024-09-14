import { redirect } from 'react-router-dom'
import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom'

import { configs } from '~/config'
import AppLayout from '~/layouts/app-layout'
import SetupLayout from '~/layouts/setup-layout'
import Dashboard from '~/pages/dashboard'
import LoginPage from '~/pages/login'

import { fakeAuthProvider } from './auth'
import { RouteName } from './name'

const title = configs.title
function getPageTitle(pageTitle?: string | null) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        id: RouteName.Dashboard,
        loader: protectedLoader,
        Component: Dashboard,
        handle: {
          title: () => getPageTitle('工作台'),
        },
      },
    ],
  },
  {
    path: '/',
    Component: SetupLayout,
    children: [
      {
        path: 'login',
        id: RouteName.Login,
        action: loginAction,
        loader: loginLoader,
        Component: LoginPage,
        handle: {
          title: () => getPageTitle(`登录`),
        },
      },
      {
        path: 'setup',
        handle: {
          title: () => getPageTitle(`初始化`),
        },
        async lazy() {
          const Setup = await import('~/pages/setup')
          return {
            Component: Setup.default,
          }
        },
      },
      {
        path: 'setup-api',
        handle: {
          title: () => getPageTitle(`初始化`),
        },
        async lazy() {
          const SetupApi = await import('~/pages/setup-api')
          return {
            Component: SetupApi.default,
          }
        },
      },
    ],
  },
  {
    path: '/logout',
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await fakeAuthProvider.signout()
      return redirect('/')
    },
  },
  {
    path: '*',
    id: '404',
    loader: () => redirect('/'),
  },
]

async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData()
  const username = formData.get('username') as string | null

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: 'You must provide a username to log in',
    }
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await fakeAuthProvider.signin(username)
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: 'Invalid login attempt',
    }
  }

  const redirectTo = formData.get('redirectTo') as string | null
  return redirect(redirectTo || '/')
}

async function loginLoader() {
  if (fakeAuthProvider.isAuthenticated) {
    return redirect('/')
  }
  return null
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access the path where the loader is located, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  const to = new URL(request.url).pathname
  if (to === '/setup-api') return null
  if (!fakeAuthProvider.isAuthenticated) {
    const params = new URLSearchParams()
    params.set('from', to)
    return redirect(`/login?${params.toString()}`)
  }
  return null
}
