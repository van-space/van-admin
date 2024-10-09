import { Suspense, useEffect } from 'react'
import QProgress from 'qier-progress'
import type React from 'react'

export const progress = new QProgress({ colorful: false, color: '#1a9cf3' })

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense fallback={<Progress />}>
      <Comp />
    </Suspense>
  )
}
const Progress = () => {
  useEffect(() => {
    progress.start()
    return () => {
      progress.finish()
    }
  })
  return ''
}
export default lazyLoad
