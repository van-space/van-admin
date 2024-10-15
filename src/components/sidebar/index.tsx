import { useEffect, useMemo, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import type { MenuModel } from '~/utils/build-menus'

import { ModeToggle } from '~/components/mode-toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { configs } from '~/configs'
import { rootRoutes } from '~/router/route'
import { useSelector } from '~/store/hooks'
// import { useSelector } from '~/store/hooks'
import { cn } from '~/utils'
import { buildMenus } from '~/utils/build-menus'

import { ScrollArea } from '../ui/scroll-area'
import { useSidebarStatusInjection } from './hooks'
import styles from './index.module.css'
import { SidebarToggle } from './sidebar-toggle'
import uwu from './uwu.png'

const Sidebar = ({
  collapse,
  width,
  onCollapseChange,
}: {
  collapse: boolean
  width: number
  onCollapseChange: (s: boolean) => void
}) => {
  const title = configs.title

  const { SidebarCollapseStatusContext, onTransitionEnd, status } =
    useSidebarStatusInjection(collapse)

  return (
    <SidebarCollapseStatusContext.Provider
      value={{
        status,
      }}
    >
      <aside
        className={cn([
          styles.root,
          collapse ? styles.collapse : null,
          styles[status],
        ])}
        style={{
          width: !collapse && width ? `${width}px` : '',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={styles.sidebar}>
          <div className="relative h-20 flex-shrink-0 text-center text-2xl font-medium">
            <div className={styles['toggle-color-btn']}>
              <ModeToggle className={styles['toggle-color-btn']} />
            </div>
            <h1 className={styles['header-title']}>
              {status === 'expanded' && (
                <img
                  alt="avatar"
                  className={
                    'absolute left-1/2 top-1/2 h-[50px] -translate-x-1/2 -translate-y-1/2 transform'
                  }
                  src={uwu}
                />
              )}
              <span className={'sr-only'}>{title}</span>
            </h1>
            <SidebarToggle
              className={styles['collapse-button']}
              isOpen={!collapse}
              setIsOpen={() => onCollapseChange(!collapse)}
            />
          </div>
          <Menu isOpen={!collapse} />
        </div>
      </aside>
    </SidebarCollapseStatusContext.Provider>
  )
}

const Menu = ({ isOpen }: { isOpen: boolean }) => {
  const [menus, setMenus] = useState<MenuModel[]>([])
  useEffect(() => {
    setMenus(buildMenus(rootRoutes))
  }, [])
  const { pathname } = useLocation()
  const viewport = useSelector((state) => state.ui.viewport)
  const isPhone = useMemo(() => viewport.mobile, [viewport.mobile])
  return (
    <ScrollArea className={styles.menu}>
      <nav className="mt-8 h-full w-full">
        <ul className={styles.items}>
          {menus.map(({ title, icon: Icon, path }) => {
            // const active = pathname === path || pathname.startsWith(path)
            return (
              <li className="w-full" key={title}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn([
                          pathname === path || pathname.startsWith(path)
                            ? styles.active
                            : '',

                          styles.item,
                        ])}
                        data-path={path}
                      >
                        <button
                          type="button"
                          className={cn([
                            'flex w-full items-center py-4',
                            !isPhone ? 'py-4' : 'py-6',
                          ])}
                        >
                          <span
                            className={cn([
                              isOpen === false ? '' : 'mr-4',
                              'flex basis-12 items-center justify-center transition-all duration-300 ease-in-out',
                              !isOpen ? 'basis-[var(--w)]' : '',
                            ])}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className={styles['item-title']}>{title}</span>
                        </button>
                      </div>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side="right">{title}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            )
          })}
        </ul>
      </nav>
    </ScrollArea>
  )
}

export default Sidebar
