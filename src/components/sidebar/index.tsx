import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
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
// import { useSelector } from '~/store/hooks'
import { cn } from '~/utils'
import { buildMenus } from '~/utils/build-menus'

import { Button } from '../ui/button'
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
  // const dispatch = useDispatch()
  // const app = useSelector((state) => state.app.app)
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
              {status}
              <ModeToggle />
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
  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menus.map(({ title, icon: Icon, path }) => {
            const active = pathname === path || pathname.startsWith(path)
            return (
              <li className="w-full" key={title}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          (active === undefined && pathname.startsWith(path)) ||
                          active
                            ? 'secondary'
                            : 'ghost'
                        }
                        className="mb-1 h-16 w-full justify-start"
                        asChild
                      >
                        <Link to={path}>
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
                        </Link>
                      </Button>
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
