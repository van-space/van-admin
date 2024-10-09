import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'

const storeApiUrlKey = 'mx-admin:setup-api:url'
const storeGatewayUrlKey = 'mx-admin:setup-api:gateway'

const apiInfoFormSchema = z.object({
  apiUrl: z.string().url(),
  gatewayUrl: z.string().url(),
  persist: z.boolean().default(true),
})
const createHistoryApiUrlState = () => {
  return JSON.safeParse(localStorage.getItem(storeApiUrlKey) || '[]')
}
const createHistoryGatewayUrlState = () => {
  return JSON.safeParse(localStorage.getItem(storeGatewayUrlKey) || '[]')
}
const SetupApi = () => {
  const [historyApiUrl, setHistoryApiUrl] = useState(createHistoryApiUrlState)
  const [historyGatewayUrl, setHistoryGatewayUrl] = useState(
    createHistoryGatewayUrlState,
  )
  const form = useForm<z.infer<typeof apiInfoFormSchema>>({
    resolver: zodResolver(apiInfoFormSchema),
    defaultValues: {
      apiUrl:
        localStorage.getItem('__api') ||
        `${location.protocol}//${location.host}/api/v2`,
      gatewayUrl:
        localStorage.getItem('__gateway') ||
        `${location.protocol}//${location.host}`,
      persist: true,
    },
  })
  const { setValue } = form
  const handleLocalDev = () => {
    setValue('apiUrl', 'http://localhost:2333')
    setValue('gatewayUrl', 'http://localhost:2333')
  }
  const handleReset = () => {
    localStorage.removeItem('__api')
    localStorage.removeItem('__gateway')

    sessionStorage.removeItem('__api')
    sessionStorage.removeItem('__gateway')
    const url = new URL(location.origin)

    location.href = url.toString()
    location.hash = ''
  }
  const handleAddApiUrl = (apiUrl: string) => {
    setHistoryApiUrl([...new Set(historyApiUrl.concat(apiUrl))])
  }
  const handleAddGatewayUrl = (gatewayUrl: string) => {
    setHistoryGatewayUrl([...new Set(historyGatewayUrl.concat(gatewayUrl))])
  }
  const handleOk = (data: z.infer<typeof apiInfoFormSchema>) => {
    const { apiUrl, gatewayUrl, persist } = data
    const fullApiUrl = transformFullUrl(apiUrl)
    const fullGatewayUrl = transformFullUrl(gatewayUrl)

    if (persist) {
      fullApiUrl && localStorage.setItem('__api', fullApiUrl)
      fullGatewayUrl && localStorage.setItem('__gateway', fullGatewayUrl)
    } else {
      fullApiUrl && sessionStorage.set('__api', fullApiUrl)
      fullGatewayUrl && sessionStorage.set('__gateway', fullGatewayUrl)
    }
    localStorage.setItem(
      storeApiUrlKey,
      JSON.stringify([...new Set(historyApiUrl.concat(apiUrl))]),
    )
    localStorage.setItem(
      storeGatewayUrlKey,
      JSON.stringify([...new Set(historyGatewayUrl.concat(gatewayUrl))]),
    )

    const url = new URL(location.origin)

    location.href = url.toString()
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <Card className="modal-card sm form-card m-auto p-4">
        <CardHeader>
          <CardTitle>设置 API</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOk)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API 地址</FormLabel>
                    <DynamicSelector
                      field={field}
                      options={historyApiUrl}
                      onAddNewOptions={handleAddApiUrl}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gatewayUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gateway 地址</FormLabel>
                    <DynamicSelector
                      field={field}
                      options={historyGatewayUrl}
                      onAddNewOptions={handleAddGatewayUrl}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="persist"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div>
                      <FormLabel>持久化</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-x-2 text-center">
                <Button type="button" onClick={handleLocalDev}>
                  本地调试
                </Button>
                <Button type="button" onClick={handleReset}>
                  重置
                </Button>
                <Button type="submit">确定</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
const DynamicSelector = ({
  field,
  options,
  onAddNewOptions,
}: {
  field: any
  options: any
  onAddNewOptions: any
}) => {
  const [newOption, setNewOption] = useState('')
  const handleInputChange = (e) => {
    setNewOption(e.target.value)
  }
  const handleClick = () => {
    if (newOption.trim() !== '') {
      onAddNewOptions(newOption.trim())
      setNewOption('')
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newOption.trim() !== '') {
      onAddNewOptions(newOption.trim())
      setNewOption('')
    }
  }
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <div className="space-y-2 p-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Add new option"
              value={newOption}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted"
              onClick={handleClick}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <SelectGroup>
            {options.map((option: any) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </div>
      </SelectContent>
    </Select>
  )
}
function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
const transformFullUrl = (url: string) => {
  if (!url) return ''

  if (url.startsWith('http')) return url
  const protocol = ['localhost', '127.0.0.1'].includes(url) ? 'http' : 'https'
  return `${protocol}://${url}`
}
export default SetupApi
