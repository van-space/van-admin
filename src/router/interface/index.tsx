import type { ReactElement } from 'react'

export interface MetaProps {
  keepAlive?: boolean
  requiresAuth?: boolean
  title: string
  key?: string
  params?: KV
  icon?: ReactElement
  query?: KV
  hide?: boolean
}

export interface RouteObject {
  caseSensitive?: boolean
  children?: RouteObject[]
  element?: React.ReactNode
  path?: string
  index?: boolean
  meta?: MetaProps
  isLink?: string
  name?: string
}
