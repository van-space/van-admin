import { useNavigate } from 'react-router-dom'
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar'

import { getAllRoutes, rootRoutes } from '~/router/route'
import { cn } from '~/utils'

export const KBarWrapper = ({ children }) => {
  const list = getAllRoutes(rootRoutes)
  const navigate = useNavigate()
  const actions = list
    .map((route) => ({
      id: route.path,
      subtitle: route.path,
      name: route.title,
      keywords: route.name,
      perform: () => navigate(route.path),
    }))
    .filter(Boolean)
  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-99 bg-gray-300 bg-opacity-80 backdrop-blur-sm backdrop-filter dark:bg-black dark:bg-opacity-25">
          <KBarAnimator className="w-[650px] max-w-[80vw] divide-y overflow-hidden rounded-lg bg-white shadow-lg">
            <KBarSearch className="box-border w-full border-none px-3 py-4 text-lg outline-none" />

            <SearchResult />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>

      {children}
    </KBarProvider>
  )
}

const SearchResult = () => {
  const matches = useMatches()

  return (
    <KBarResults
      items={matches.results}
      onRender={({ item, active }) => {
        if (typeof item === 'string') {
          return <div className="p-2">{item}</div>
        }
        return (
          <div
            key={item.id}
            className={cn([
              'box-border flex h-[50px] cursor-pointer select-none flex-col px-3 py-2',
              active && 'bg-gray-200 bg-opacity-50',
            ])}
          >
            <div>{item.name}</div>
            {item.subtitle && (
              <div className="text-gray-400">{item.subtitle}</div>
            )}
          </div>
        )
      }}
    />
  )
}
