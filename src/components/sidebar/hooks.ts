import { createContext, useEffect, useRef, useState } from 'react'

const useSidebarStatusImpl = (collapse: boolean) => {
  const prevValue = useRef(collapse)

  const [status, setStatus] = useState(
    prevValue.current ? 'collapsed' : 'expanded',
  )

  useEffect(() => {
    if (prevValue.current !== collapse) {
      setStatus(collapse ? 'collapsing' : 'expanding')
      prevValue.current = collapse
    }
  }, [collapse])

  const onTransitionEnd = () => {
    setStatus(collapse ? 'collapsed' : 'expanded')
  }

  return { status, onTransitionEnd } as const
}

const SidebarCollapseStatusContext = createContext({
  status: 'collapsed',
})
export const useSidebarStatusInjection = (collapse: boolean) => {
  const { onTransitionEnd, status } = useSidebarStatusImpl(collapse)

  return { SidebarCollapseStatusContext, onTransitionEnd, status }
}
