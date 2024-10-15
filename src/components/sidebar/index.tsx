import { LogOut } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
// import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import type { MenuModel } from '~/utils/build-menus'

import { ModeToggle } from '~/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { configs } from '~/configs'
import { WEB_URL } from '~/constants/env'
import { rootRoutes } from '~/router/route'
import { useSelector } from '~/store/hooks'
// import { useSelector } from '~/store/hooks'
import { cn } from '~/utils'
import { removeToken } from '~/utils/auth'
import { signOut } from '~/utils/authjs'
import { buildMenus } from '~/utils/build-menus'
import { RESTManager } from '~/utils/rest'

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
  const user = useSelector((state) => state.user)
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
          <button
            type="button"
            className={styles['sidebar-footer']}
            onClick={() => {
              window.open(WEB_URL)
            }}
          >
            <LogoutAvatarButton avatar={user.user?.avatar} />

            <span className={styles['sidebar-username']}>
              {user.user?.name}
            </span>
          </button>
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
      <nav className="h-full w-full">
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
                            <Icon className="h-4 w-4" />
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

const LogoutAvatarButton = ({ avatar }: { avatar?: string }) => {
  const navigate = useNavigate()
  const handleLogout = async (e: any) => {
    e.stopPropagation()
    await RESTManager.api.user.logout.post({})
    removeToken()
    await signOut()
    navigate('/login')
    console.log('logout')
  }
  return (
    <div className="relative h-[35px] w-[35px]" onClick={handleLogout}>
      <Avatar className="h-50 w-50 absolute inset-0 z-1">
        <AvatarImage src={avatar} />
        <AvatarFallback>VAN</AvatarFallback>
      </Avatar>
      <div className="bg-dark-200 absolute inset-0 z-10 flex items-center justify-center rounded-full bg-opacity-80 text-xl opacity-0 transition-opacity hover:opacity-50">
        <LogOut />
      </div>
    </div>
  )
}
export default Sidebar
