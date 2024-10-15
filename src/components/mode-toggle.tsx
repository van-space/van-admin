import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useTheme } from '~/providers/theme-provider'
import { uiSlice } from '~/store/slice/ui.slice'

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch<any>(uiSlice.actions.toggleDark(theme === 'dark'))
  }, [theme, dispatch])
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={className}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-white transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
            <MoonIcon className="scale-1000 absolute h-[1.2rem] w-[1.2rem] rotate-0 text-white transition-transform duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">切换主题</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
