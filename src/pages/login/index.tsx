import {
  Form,
  useActionData,
  useLocation,
  useNavigation,
} from 'react-router-dom'

const LoginPage = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const from = params.get('from') || '/'

  const navigation = useNavigation()
  const isLoggingIn = navigation.formData?.get('username') != null

  const actionData = useActionData() as { error: string } | undefined

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <Form method="post" replace>
        <div>
          <input type="hidden" name="redirectTo" value={from} />
          <label>
            Username: <input name="username" />
          </label>{' '}
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" />
          </label>{' '}
        </div>
        <div>
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </div>
        {actionData && actionData.error ? (
          <p style={{ color: 'red' }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  )
}

export default LoginPage
