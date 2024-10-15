import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import { useKeyPress } from 'ahooks'
import type { CSSProperties } from 'react'

import { KBarWrapper } from '~/components/k-bar'
import Sidebar from '~/components/sidebar'
import { GATEWAY_URL } from '~/constants/env'
import { useSelector } from '~/store/hooks'
import { uiSlice } from '~/store/slice/ui.slice'
import { cn } from '~/utils'
import { RESTManager } from '~/utils/rest'

import styles from './index.module.css'

export const SidebarLayout = () => {
  const [isInApiDebugMode] = useState(() => {
    return (
      localStorage.getItem('__api') ||
      localStorage.getItem('__gateway') ||
      sessionStorage.getItem('__api') ||
      sessionStorage.getItem('__gateway') ||
      window.injectData.PAGE_PROXY
    )
  })
  const dispatch = useDispatch()
  const collapse = useSelector((state) => state.ui.sidebarCollapse)
  const viewport = useSelector((state) => state.ui.viewport)
  const sidebarWidth = useSelector((state) => state.ui.sidebarWidth)
  useKeyPress('uparrow', () => {
    dispatch(uiSlice.actions.toggleSidebar(!collapse))
  })

  const isLaptop = useMemo(
    () => viewport.mobile || viewport.pad,
    [viewport.mobile, viewport.pad],
  )
  useEffect(() => {
    dispatch(uiSlice.actions.toggleSidebar(!!isLaptop))
  }, [dispatch, isLaptop])
  return (
    <KBarWrapper>
      <div className={styles.root}>
        {isInApiDebugMode && (
          <div
            className={cn([
              'bg-dark-800 z-2 fixed left-0 right-0 top-0 flex h-[40px] items-center whitespace-pre text-gray-400 transition-all duration-500',
              window.injectData.PAGE_PROXY && 'bg-red-900',
            ])}
            style={{
              paddingLeft: !collapse ? '270px' : '80px',
            }}
          >
            You are in customizing the API endpoint mode, please check:{' '}
            <Link to={'/setup-api'}>setup-api</Link>. Endpoint:{' '}
            {RESTManager.endpoint}, Gateway: {GATEWAY_URL}
            {window.injectData.PAGE_PROXY && ', Dashboard is in local dev mode'}
          </div>
        )}
        <Sidebar
          collapse={collapse}
          width={sidebarWidth}
          onCollapseChange={(s: boolean) => {
            dispatch(uiSlice.actions.toggleSidebar(!!s))
          }}
        />
        <main
          className={styles.content}
          style={
            {
              left: !collapse ? `${sidebarWidth}px` : '50px',
              pointerEvents: isLaptop && !collapse ? 'none' : 'auto',
              top: isInApiDebugMode && '40px',
            } as CSSProperties
          }
        >
          <Outlet />
        </main>
      </div>
    </KBarWrapper>
  )
}
