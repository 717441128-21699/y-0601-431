import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  icon: React.ReactNode
  color: string
}

export default function MetricCard({ title, value, unit, trend, trendValue, icon, color }: MetricCardProps) {
  const trendConfig = {
    up: { icon: ArrowUp, color: 'text-emerald-400' },
    down: { icon: ArrowDown, color: 'text-red-400' },
    stable: { icon: Minus, color: 'text-amber-400' },
  }

  const TrendIcon = trendConfig[trend].icon
  const trendColor = trendConfig[trend].color

  return (
    <div className={`rounded-xl bg-gradient-to-br ${color} border border-emerald-800/20 p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-emerald-400/60 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-white font-mono">{value}</span>
            <span className="text-sm text-emerald-300/60 ml-1">{unit}</span>
          </div>
          <div className={`mt-2 flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{trendValue}</span>
          </div>
        </div>
        <div className="rounded-lg bg-emerald-900/40 p-2.5 text-emerald-300">
          {icon}
        </div>
      </div>
    </div>
  )
}
