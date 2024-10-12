/* eslint-disable @typescript-eslint/no-use-before-define */
import type { RouteObject } from '~/router/interface'

export interface MenuModel {
  title: string
  path: string
  icon: any
  subItems?: Array<MenuModel>
  hasParent: boolean
  fullPath: string
  query?: any
}

const parsePath = (path: string, params?: KV) => {
  // 1. add slash
  let n = /^\//.test(path) ? path : `/${path}`

  // 2. replace default params into path
  const hasParams = n.match(/(\/?:)/)
  if (!hasParams) {
    return n
  }
  if (!params || Object.prototype.toString.call(params) !== '[object Object]') {
    throw new TypeError('params must be object')
  }
  for (const paramKey in params) {
    n = n.replaceAll(`:${paramKey}`, params[paramKey])
  }
  return n
}

const buildModel = (
  item: RouteObject,
  hasParent: boolean,
  prevPath: string,
): MenuModel => {
  const path = parsePath(item.path!, item.meta?.params)

  const fullPath = `${prevPath}/${path}`

  return {
    title: (item.meta?.title as string) || path,
    path: path,
    icon: item.meta?.icon as any,
    subItems: buildSubMenus(item, fullPath),
    hasParent,
    fullPath: fullPath.replaceAll('//', '/'),
    query: item.meta?.query,
  }
}
function buildSubMenus(route: RouteObject, prevPath = '') {
  if (Array.isArray(route.children)) {
    return route.children
      .filter((item) => {
        if (!item.meta) {
          return true
        }
        return item.meta.hide !== true
      })
      .map((item) => {
        return buildModel(item, true, prevPath)
      })
  }
  return []
}

export const buildMenus = (routes: Array<RouteObject>): MenuModel[] => {
  return (
    routes.find((item) => item.name === 'home' && item.path === '/') as any
  ).children
    .filter(
      (item: RouteObject) => item.path !== '*' && item.meta?.hide !== true,
    )
    .map((item: RouteObject) => {
      return buildModel(item, false, '')
    })
}

export { buildModel as buildMenuModel }
