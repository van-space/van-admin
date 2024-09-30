import { KBarWrapper } from '~/components/k-bar'
import { cn } from '~/utils'

import styles from './index.module.css'

const isInApiDebugMode =
  localStorage.getItem('__api') ||
  localStorage.getItem('__gateway') ||
  sessionStorage.getItem('__api') ||
  sessionStorage.getItem('__gateway') ||
  window.injectData.PAGE_PROXY

export const SidebarLayout = () => {
  return (
    <KBarWrapper>
      <div className={styles.root}>
        {isInApiDebugMode ? (
          <div
            className={cn([
              'bg-dark-800 z-2 fixed left-0 right-0 top-0 flex h-[40px] items-center whitespace-pre text-gray-400 transition-all duration-500',
              window.injectData.PAGE_PROXY && 'bg-red-900',
            ])}
          >
            123
          </div>
        ) : (
          ''
        )}
      </div>
    </KBarWrapper>
  )
}
