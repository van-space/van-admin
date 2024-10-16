import { format as f } from 'date-fns'

export enum DateFormat {
  'yyyy 年 M 月 d 日' = 1,
  'yyyy 年 M 月 d 日 HH:mm:ss' = 2,
  'HH:mm' = 3,

  'H:mm:ss A' = 4,
  'M-d HH:mm:ss' = 5,
}

export const parseDate = (
  time: string | Date,
  format: keyof typeof DateFormat = 'yyyy 年 M 月 d 日',
) => {
  const date = new Date(time)
  if (Number.isNaN(date as any)) return 'N/A'
  return f(date, format)
}

export const relativeTimeFromNow = (
  time: Date | string,
  current = new Date(),
) => {
  if (!time) {
    return '-'
  }
  const _time = new Date(time)
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = +current - +_time

  if (elapsed < msPerMinute) {
    const gap = Math.ceil(elapsed / 1000)
    return gap <= 0 ? '刚刚' : `${gap} 秒前`
  }
  if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} 分钟前`
  }
  if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} 小时前`
  }
  if (elapsed < msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} 天前`
  }
  if (elapsed < msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} 个月前`
  }
  return `${Math.round(elapsed / msPerYear)} 年前`
}

export const getDayOfYear = (date = new Date()) => {
  const now = date
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)

  return day
}
