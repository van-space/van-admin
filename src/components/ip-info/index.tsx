import { type ReactNode, useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { RESTManager } from '~/utils/rest'

interface IP {
  ip: string
  countryName: string
  regionName: string
  cityName: string
  ownerDomain: string
  ispDomain: string
  range?: {
    from: string
    to: string
  }
}
const ipLocationCacheMap = new Map<string, IP>()

const IpInfoPopover = ({
  ip,
  triggerEl,
  trigger,
}: {
  ip: string
  triggerEl: ReactNode
  trigger: 'click' | 'hover' | 'focus' | 'manual'
}) => {
  const [ipInfoText, setIpInfoText] = useState<string>('获取中..')

  const setNormalizeIpInfoText = (info: IP) => {
    setIpInfoText(`IP: ${info.ip}<br />
      城市：${
        [info.countryName, info.regionName, info.cityName]
          .filter(Boolean)
          .join(' - ') || 'N/A'
      }<br />
      ISP: ${info.ispDomain || 'N/A'}<br />
      组织：${info.ownerDomain || 'N/A'}<br />
      范围：${info.range ? Object.values(info.range).join(' - ') : 'N/A'}
      `)
  }
  const resetIpInfoText = () => setIpInfoText('获取中..')
  const onIpInfoShow = async (show: boolean, ip: string) => {
    if (!ip) {
      return
    }

    if (show) {
      if (ipLocationCacheMap.has(ip)) {
        const ipInfo = ipLocationCacheMap.get(ip)!
        setNormalizeIpInfoText(ipInfo)
        return
      }

      const data: any = await RESTManager.api.fn('built-in').ip.get({
        params: {
          ip,
        },
      })

      setNormalizeIpInfoText(data)
      ipLocationCacheMap.set(ip, data)
    } else {
      resetIpInfoText()
    }
  }
  return (
    <Popover
      onOpenChange={async (show) => {
        if (!ip) return
        await onIpInfoShow(show, ip)
      }}
    >
      <PopoverTrigger>{triggerEl}</PopoverTrigger>
      <PopoverContent>
        <div
          dangerouslySetInnerHTML={{
            __html: ipInfoText,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default IpInfoPopover
