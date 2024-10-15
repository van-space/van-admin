import { ChevronFirst } from 'lucide-react'

import { cn } from '~/utils'

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
  className: string
}

export function SidebarToggle({
  isOpen,
  setIsOpen,
  className,
}: SidebarToggleProps) {
  return (
    <button type="button" onClick={() => setIsOpen?.()} className={className}>
      <ChevronFirst
        className={cn(
          'h-4 w-4 transition-transform duration-700 ease-in-out',
          isOpen === false ? 'rotate-180' : 'rotate-0',
        )}
      />
    </button>
  )
}
