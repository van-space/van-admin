import { defineStepper } from '@stepperize/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { TagInput } from 'emblor'
import { z } from 'zod'
import type { Stepper } from '@stepperize/react'
import type { Tag } from 'emblor'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { LoadingSpinner } from '~/components/ui/icons'
import { Input } from '~/components/ui/input'
import { getToken, removeToken } from '~/utils/auth'
import { showConfetti } from '~/utils/confetti'
import { checkIsInit } from '~/utils/is-init'
import { RESTManager } from '~/utils/rest'

import styles from './index.module.css'

const { useStepper } = defineStepper(
  { id: '1', title: '(๑•̀ㅂ•́)و✧', description: '让我们开始吧' },
  { id: '2', title: '站点设置', description: '先设置一下站点相关配置吧' },
  { id: '3', title: '主人信息', description: '请告诉你的名字' },
  { id: '4', title: '(๑•̀ㅂ•́)و✧', description: '一切就绪了' },
)
const defaultConfigsContext = createContext<Record<string, any>>({})
const Setup = () => {
  const [defaultConfigs, setDefaultConfigs] = useState<Record<string, any>>({
    a: 1,
  })
  useEffect(() => {
    const init = async () => {
      await checkIsInit()
      if (getToken()) {
        removeToken()
      }
      const configs = await RESTManager.api.init.configs.default.get<any>()
      console.log('🚀 ~ init ~ configs:', configs)
      setDefaultConfigs((prev) => ({
        ...prev,
        ...configs,
      }))
    }
    init()
  }, [])

  const stepper = useStepper()

  return (
    <defaultConfigsContext.Provider value={defaultConfigs}>
      <div className={styles.full}>
        <Card className="modal-card sm form-card m-auto p-4">
          <CardTitle>初始化</CardTitle>
          {JSON.stringify(defaultConfigs) === '{}' ? (
            <div className="py-4 text-center">
              <span>
                <LoadingSpinner className="w-10" />
              </span>
            </div>
          ) : (
            <>
              <CardHeader>
                <CardTitle>{stepper.current.title}</CardTitle>
                <CardDescription>
                  {stepper.current.description}{' '}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stepper.when('1', () => (
                  <Step0 stepper={stepper} />
                ))}
                {stepper.when('2', () => (
                  <Step1 stepper={stepper} />
                ))}
                {stepper.when('3', () => (
                  <Step2 stepper={stepper} />
                ))}
                {stepper.when('4', () => (
                  <Step3 stepper={stepper} />
                ))}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </defaultConfigsContext.Provider>
  )
}
const Step0 = ({ stepper }: { stepper: Stepper<any> }) => {
  const handleUploadAndRestore = async () => {
    const $file = document.createElement('input')
    $file.type = 'file'
    $file.style.cssText =
      'position: absolute; opacity: 0; z-index: -9999;top: 0; left: 0'
    $file.accept = '.zip'
    document.body.append($file)
    $file.click()
    $file.addEventListener('change', () => {
      const file = $file.files![0]
      const formData = new FormData()
      formData.append('file', file)
      RESTManager.api.init.restore
        .post({
          data: formData,
          timeout: 1 << 30,
        })
        .then(() => {
          toast.success('恢复成功，页面即将重载')
          setTimeout(() => {
            location.reload()
          }, 1000)
        })
    })
  }
  return (
    <div className="flex justify-center space-x-4 text-center">
      <Button
        type="button"
        variant="secondary"
        onClick={handleUploadAndRestore}
      >
        还原备份
      </Button>
      <Button type="button" onClick={stepper.next}>
        开始
      </Button>
    </div>
  )
}
const siteInfoFormSchema = z.object({
  title: z.string().min(2, {
    message: '标题必须大于2个字符',
  }),
  description: z.string().min(2, {
    message: '站点描述必须大于2个字符',
  }),
  keywords: z.array(z.any()).optional(),
  adminUrl: z.string().optional(),
  serverUrl: z.string().optional(),
  webUrl: z.string().optional(),
  wsUrl: z.string().optional(),
})
const Step1 = ({ stepper }: { stepper: Stepper<any> }) => {
  const defaultConfigs = useContext(defaultConfigsContext)
  const form = useForm<z.infer<typeof siteInfoFormSchema>>({
    resolver: zodResolver(siteInfoFormSchema),
    defaultValues: {
      title: defaultConfigs?.seo?.title ?? '',
      keywords: defaultConfigs?.seo?.keywords ?? [],
      description: defaultConfigs?.seo?.description ?? '',
      adminUrl: `${location.origin}/qaqdmin`,
      serverUrl: `${location.origin}/api/v2`,
      webUrl: location.origin ?? '',
      wsUrl: location.origin ?? '',
    },
  })
  const [tags, setTags] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  // 2. Define a submit handler.
  const handleNext = async (values: z.infer<typeof siteInfoFormSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    // await Promise.all([
    //   RESTManager.api.init.configs('seo').patch({
    //     data: {
    //       title: values.title,
    //       keywords: values.keywords,
    //       description: values.description,
    //     },
    //   }),
    //   RESTManager.api.init.configs('url').patch({
    //     data: {
    //       adminUrl: values.adminUrl,
    //       serverUrl: values.serverUrl,
    //       webUrl: values.webUrl,
    //       wsUrl: values.wsUrl,
    //     },
    //   }),
    // ])
    stepper.next()
  }
  const { setValue } = form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>站点标题</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>站点描述</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">关键字</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags)
                    setValue('keywords', newTags as [Tag, ...Tag[]])
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="webUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>前端地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API 地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>后台地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wsUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gateway 地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">下一步</Button>
      </form>
    </Form>
  )
}
const userInfoFormSchema = z.object({
  username: z.string().min(2, {
    message: '你的名字必须大于2个字符',
  }),
  name: z.string().optional(),
  mail: z.string().email({
    message: '请输入有效的邮箱地址',
  }),
  password: z.string().min(6, {
    message: '密码必须大于6个字符',
  }),
  repassword: z.string().min(6, {
    message: '密码必须大于6个字符',
  }),
  url: z.string().optional(),
  avatar: z.string().optional(),
  introduce: z.string().optional(),
})
const Step2 = ({ stepper }: { stepper: Stepper<any> }) => {
  const form = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      username: '',
      name: '',
      mail: '',
      password: '',
      repassword: '',
      url: '',
      avatar: '',
      introduce: '',
    },
  })

  // 2. Define a submit handler.
  const handleNext = async (values: z.infer<typeof userInfoFormSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    if (values.password !== values.repassword) {
      toast.error('两次密码不一致')
      return
    }
    const user = {}
    for (const key in values) {
      if (values[key] === '') {
        user[key] = undefined
      } else {
        user[key] = values[key]
      }
    }
    console.log(user)

    // await RESTManager.api.user.register.post({
    //   data: {
    //     ...user,
    //   },
    // })
    stepper.next()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>你的名字 (登录凭证)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人首页</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>头像</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="introduce"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人介绍</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">下一步</Button>
      </form>
    </Form>
  )
}

const Step3 = (_: { stepper: Stepper<any> }) => {
  useEffect(() => {
    showConfetti()
  })
  const handleClick = () => {
    localStorage.setItem('to-setting', 'true')
    setTimeout(() => {
      location.reload()
    }, 200)
  }
  return (
    <div className="space-y-4">
      <span className="text-base">你已经完成了所有的步骤，干得漂亮。</span>
      <div>
        <Button type="submit" onClick={handleClick}>
          LINK START
        </Button>
      </div>
    </div>
  )
}
export default Setup
