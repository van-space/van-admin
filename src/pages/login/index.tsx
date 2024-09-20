import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import type { BuiltInProviderType } from '@auth/core/providers'
import type { UserModel } from '~/models/user'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar'
import { Button } from '~/components/ui/Button'
import { GithubIcon, PassKeyOutlineIcon } from '~/components/ui/Icons'
import { Input } from '~/components/ui/Input'
import { SESSION_WITH_LOGIN } from '~/constants/keys'
import { useSelector } from '~/store/hooks'
import { fetchUser, userSlice } from '~/store/slice/user.slice'
import { signIn } from '~/utils/authjs'
import { AuthnUtils } from '~/utils/authn'
import { checkIsInit } from '~/utils/is-init'
import { RESTManager } from '~/utils/rest'

import styles from './index.module.css'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)

  const user = useSelector((state) => state.user.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const from = new URLSearchParams(location.search).get('from') || '/'
  useEffect(() => {
    const initialize = async () => {
      const isInit = await checkIsInit()
      if (!isInit) {
        navigate('/setup')
        return
      }
      dispatch(fetchUser() as any)
    }
    initialize()
  }, [navigate, dispatch])
  const postSuccessfulLogin = useCallback(
    (token?: string) => {
      dispatch(userSlice.actions.updateToken({ token }))
      navigate(from)
      sessionStorage.setItem(SESSION_WITH_LOGIN, '1')
      toast.success('欢迎回来')
    },
    [dispatch, navigate, from],
  )
  const { data: settings } = useQuery({
    queryKey: ['allow-password'],
    queryFn: () => {
      return RESTManager.api.user('allow-login').get<
        {
          password: boolean
          passkey: boolean
        } & Record<BuiltInProviderType, boolean>
      >()
    },
  })
  const passkeyAuth = useCallback(() => {
    AuthnUtils.validate().then((res) => {
      if (!res) {
        return toast.error('验证失败')
      }
      const token = res.token

      postSuccessfulLogin(token)
    })
  }, [postSuccessfulLogin])

  const triggerAuthnOnce = useRef(false)
  useEffect(() => {
    if (triggerAuthnOnce.current) return
    if (settings?.password === false) {
      triggerAuthnOnce.current = true
      passkeyAuth()
    }
  }, [passkeyAuth, settings])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLogin = useCallback(
    async (e: any) => {
      if (loading) return
      e.preventDefault()
      const psw = inputRef.current?.value
      if (!psw) {
        return toast.error('密码不能为空')
      }
      if (!user || !user.username) {
        return toast.error('主人信息无法获取')
      }
      setLoading(true)
      try {
        const res = await RESTManager.api.master.login.post<{
          token: string & UserModel
        }>({
          data: {
            username: user?.username,
            password: inputRef.current?.value,
          },
        })
        if (res.token) {
          postSuccessfulLogin(res.token)
        } else {
          toast.error('登录失败，令牌无效')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || '登录失败')
      } finally {
        setLoading(false)
      }
    },
    [loading, postSuccessfulLogin, user],
  )
  const showPasswordInput =
    typeof settings === 'undefined' || settings.password === true
  return (
    <div className={styles.r}>
      <div className="wrapper">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>VAN</AvatarFallback>
        </Avatar>

        {showPasswordInput && (
          <form
            aria-disabled={loading}
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin(e)
            }}
          >
            <div className="input-wrap">
              <Input ref={inputRef} type="password" />
            </div>
            <div className="flex items-center gap-4">
              {settings?.passkey && (
                <div className="-mt-4 mb-4 flex w-full justify-center space-x-4">
                  <Button
                    color="#ACA8BF70"
                    variant="default"
                    type="button"
                    onClick={() => {
                      passkeyAuth()
                    }}
                  >
                    <PassKeyOutlineIcon />
                  </Button>
                </div>
              )}
              {settings?.github && (
                <div className="-mt-4 mb-4 flex w-full justify-center space-x-4">
                  <Button
                    color="#ACA8BF70"
                    variant="default"
                    type="button"
                    onClick={() => {
                      signIn('github', {
                        callbackUrl: `${window.location.origin}${window.location.pathname}#${from || ''}`,
                      })
                    }}
                  >
                    <GithubIcon />
                  </Button>
                </div>
              )}
              {settings?.google && (
                <div className="-mt-4 mb-4 flex w-full justify-center space-x-4">
                  <Button
                    color="#ACA8BF70"
                    variant="default"
                    type="button"
                    onClick={() => {
                      signIn('google', {
                        callbackUrl: `${window.location.origin}${window.location.pathname}#${from || ''}`,
                      })
                    }}
                  >
                    <img
                      alt="Google"
                      className="h-4 w-4 grayscale filter"
                      src="https://authjs.dev/img/providers/google.svg"
                    />
                  </Button>
                </div>
              )}
              <Button
                disabled={loading}
                type="button"
                title="登录"
                variant="secondary"
                className="p-button-raised p-button-rounded"
                onClick={(e) => handleLogin(e)}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
