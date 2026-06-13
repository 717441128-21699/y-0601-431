import { useState } from 'react'
import { cn } from '@/lib/utils'
import { provinces } from '@/data/mockData'

const provincePositions = [
  { name: '陕西', col: 2, row: 1, abbr: '陕' },
  { name: '北京', col: 4, row: 1, abbr: '京' },
  { name: '山东', col: 5, row: 1, abbr: '鲁' },
  { name: '四川', col: 1, row: 2, abbr: '川' },
  { name: '重庆', col: 2, row: 2, abbr: '渝' },
  { name: '湖北', col: 3, row: 2, abbr: '鄂' },
  { name: '江苏', col: 4, row: 2, abbr: '苏' },
  { name: '浙江', col: 3, row: 3, abbr: '浙' },
  { name: '上海', col: 4, row: 3, abbr: '沪' },
  { name: '福建', col: 5, row: 3, abbr: '闽' },
  { name: '广东', col: 4, row: 4, abbr: '粤' },
]

function getHealthColor(index: number): string {
  if (index < 60) return 'bg-red-500/60 border-red-500/30'
  if (index < 75) return 'bg-yellow-600/40 border-yellow-600/30'
  if (index < 85) return 'bg-emerald-600/40 border-emerald-600/30'
  return 'bg-emerald-700/60 border-emerald-500/30'
}

function getHealthTextColor(index: number): string {
  if (index < 60) return 'text-red-300'
  if (index < 75) return 'text-yellow-300'
  if (index < 85) return 'text-emerald-300'
  return 'text-emerald-200'
}

export default function ChinaMap() {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const healthMap = new Map(provinces.map(p => [p.name, p.avgHealthIndex]))

  function handleMouseEnter(name: string, e: React.MouseEvent) {
    setHoveredProvince(name)
    const rect = (e.currentTarget as HTMLElement).closest('.map-container')?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  function handleMouseLeave() {
    setHoveredProvince(null)
    setTooltipPos(null)
  }

  const gridCols = 6
  const gridRows = 5

  return (
    <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
      <h3 className="mb-4 text-base font-semibold text-emerald-100">全国绿地健康热力图</h3>
      <div className="map-container relative">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, 80px)`,
          }}
        >
          {provincePositions.map(p => {
            const healthIndex = healthMap.get(p.name) ?? 0
            return (
              <div
                key={p.name}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border text-xs transition-all duration-200 cursor-default',
                  getHealthColor(healthIndex),
                  hoveredProvince === p.name && 'ring-1 ring-emerald-400/50 scale-105'
                )}
                style={{
                  gridColumn: p.col,
                  gridRow: p.row,
                }}
                onMouseEnter={e => handleMouseEnter(p.name, e)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-sm font-bold text-white">{p.abbr}</span>
                <span className={cn('mt-0.5 text-[10px]', getHealthTextColor(healthIndex))}>
                  {healthIndex.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>

        {hoveredProvince && tooltipPos && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-emerald-700/40 bg-[#0A1A14]/95 px-3 py-2 text-xs shadow-xl"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 40,
            }}
          >
            <div className="font-medium text-emerald-100">{hoveredProvince}</div>
            <div className="mt-0.5 text-emerald-400">
              健康指数: {healthMap.get(hoveredProvince)?.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-emerald-400/70">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-red-500/60" />
          <span>&lt;60</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-yellow-600/40" />
          <span>60-75</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-emerald-600/40" />
          <span>75-85</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-emerald-700/60" />
          <span>85+</span>
        </div>
      </div>
    </div>
  )
}
