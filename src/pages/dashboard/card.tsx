import type { ReactNode } from 'react'

import { Card } from '~/components/ui/card'

export interface CardProps {
  label: string
  value: number | string
  icon: ReactNode
  actions?: {
    name: string
    onClick: () => void
    primary?: boolean
    showBadage?: boolean
  }[]
}
const DashboardCard = ({ label, actions = [], icon, value }: CardProps) => {
  return (
    <Card>
      {label}
      {icon} {value}
    </Card>
  )
}

export default DashboardCard
