import { cn } from '@/lib/utils'
import { cities } from '@/data/mockData'

const top10 = [...cities]
  .sort((a, b) => b.maintenanceEfficiency - a.maintenanceEfficiency)
  .slice(0, 10)

const maxEff = top10[0]?.maintenanceEfficiency ?? 1

const rankAccents = [
  'bg-gradient-to-r from-amber-500/80 to-amber-600/60',
  'bg-gradient-to-r from-gray-300/80 to-gray-400/60',
  'bg-gradient-to-r from-amber-700/80 to-amber-800/60',
]

export default function EfficiencyRanking() {
  return (
    <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
      <h3 className="mb-4 text-base font-semibold text-emerald-100">养护效率排名 TOP10</h3>
      <div className="flex flex-col gap-2.5">
        {top10.map((city, i) => (
          <div key={city.name} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold',
                i < 3
                  ? 'bg-emerald-900/60 text-amber-400'
                  : 'bg-emerald-900/30 text-emerald-500/60'
              )}
            >
              {i + 1}
            </span>
            <span className="w-12 flex-shrink-0 truncate text-xs text-emerald-200/80">
              {city.name}
            </span>
            <div className="relative h-5 flex-1 overflow-hidden rounded bg-emerald-900/20">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded transition-all',
                  i < 3 ? rankAccents[i] : 'bg-gradient-to-r from-emerald-600/50 to-emerald-700/30'
                )}
                style={{ width: `${(city.maintenanceEfficiency / maxEff) * 100}%` }}
              />
            </div>
            <span className="w-10 flex-shrink-0 text-right text-xs font-medium text-emerald-300">
              {city.maintenanceEfficiency.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
