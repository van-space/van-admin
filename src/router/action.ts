import { redirect } from 'react-router-dom'
import type { UserModel } from '~/models/user'
import type { LoaderFunctionArgs } from 'react-router-dom'

import { SESSION_WITH_LOGIN } from '~/constants/keys'
import { RESTManager } from '~/utils/rest'

export async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData()
  const username = formData.get('username') as string | null
  const password = formData.get('password') as string | null

  // Validate our form inputs and return validation errors via useActionData()
  if (!username || !password) {
    return {
      error: 'You must provide a username or password to log in',
    }
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    const res = await RESTManager.api.master.login.post<{
      token: string & UserModel
    }>({
      data: {
        username,
        password,
      },
    })
    if (res.token) {
      sessionStorage.setItem(SESSION_WITH_LOGIN, '1')
    }
  } catch (_error) {
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
