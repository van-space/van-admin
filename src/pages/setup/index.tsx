import { defineStepper } from '@stepperize/react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/Button'
import { getToken, removeToken } from '~/utils/auth'
import { checkIsInit } from '~/utils/is-init'
import { RESTManager } from '~/utils/rest'

const { useStepper } = defineStepper(
  { id: '1', title: '(๑•̀ㅂ•́)و✧', description: '让我们开始吧' },
  { id: '2', title: '站点设置', description: '先设置一下站点相关配置吧' },
  { id: '3', title: '主人信息', description: '请告诉你的名字' },
  { id: '4', title: '(๑•̀ㅂ•́)و✧', description: '一切就绪了' },
)

const Setup = () => {
  const [defaultConfigs, setDefaultConfigs] = useState<Record<string, any>>({})
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
    <div className="bg-gray-3 my-4 flex flex-col gap-4 rounded-md p-4">
      {stepper.when('1', (step) => (
        <p>{step.title}</p>
      ))}

      {stepper.when('2', (step) => (
        <p>{step.title}</p>
      ))}

      {stepper.when('3', (step) => (
        <p>{step.title}</p>
      ))}

      {stepper.when('4', (step) => (
        <p>{step.title}</p>
      ))}

      {!stepper.isLast ? (
        <div className="flex items-center gap-2">
          <Button onClick={stepper.prev} disabled={stepper.isFirst}>
            Previous
          </Button>

          <Button onClick={stepper.next}>
            {stepper.when(
              '4',
              () => 'Finish',
              () => 'Next',
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={stepper.reset}>Reset</Button>
        </div>
      )}
    </div>
  )
}

const Step0 = () => {}

export default Setup
