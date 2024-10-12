import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '~/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useTheme } from '~/providers/theme-provider'
import { uiSlice } from '~/store/slice/ui.slice'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch<any>(uiSlice.actions.toggleDark(theme === 'dark'))
  }, [theme, dispatch])
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="mr-2 h-8 w-8 rounded-full bg-background"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
            <MoonIcon className="scale-1000 absolute h-[1.2rem] w-[1.2rem] rotate-0 transition-transform duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
