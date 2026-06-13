import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'

const pageNames: Record<string, string> = {
  '/': '核心看板',
  '/alerts': '预警管理',
  '/plan': '养护计划',
  '/reports': '诊断报告',
}

const parkTypes = ['综合公园', '社区公园', '专类公园', '带状公园']

function formatTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export default function Header() {
  const location = useLocation()
  const selectedProvince = useAppStore((s) => s.selectedProvince)
  const setProvince = useAppStore((s) => s.setProvince)
  const selectedCity = useAppStore((s) => s.selectedCity)
  const setCity = useAppStore((s) => s.setCity)
  const selectedParkType = useAppStore((s) => s.selectedParkType)
  const setParkType = useAppStore((s) => s.setParkType)
  const visibleProvinces = useAppStore((s) => s.visibleProvinces)
  const visibleCities = useAppStore((s) => s.visibleCities)
  const currentUser = useAppStore((s) => s.currentUser)

  const [currentTime, setCurrentTime] = useState(formatTime(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const pageName = location.pathname.startsWith('/park/')
    ? '公园详情'
    : pageNames[location.pathname] || '页面'

  const isCityLevel = currentUser.role === '市级'
  const isProvinceLevelOrBelow = currentUser.role === '省级' || currentUser.role === '市级' || currentUser.role === '区绿化办'
  const showCitySelect = isProvinceLevelOrBelow || selectedProvince !== null

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-[#0D1B16] border-b border-emerald-900/30 z-40 flex items-center justify-between px-6">
      <div className="text-sm text-emerald-300/70">
        <span className="text-emerald-500/50">绿地智管</span>
        <span className="mx-2 text-emerald-700/40">/</span>
        <span className="text-emerald-200">{pageName}</span>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={isCityLevel ? currentUser.province ?? '' : selectedProvince ?? ''}
          onChange={(e) => setProvince(e.target.value || null)}
          disabled={isCityLevel}
          className="bg-emerald-950/50 border border-emerald-800/30 text-emerald-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-600/50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {!isProvinceLevelOrBelow && <option value="">全国</option>}
          {visibleProvinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {showCitySelect && (
          <select
            value={isCityLevel ? currentUser.city ?? '' : selectedCity ?? ''}
            onChange={(e) => setCity(e.target.value || null)}
            disabled={isCityLevel}
            className="bg-emerald-950/50 border border-emerald-800/30 text-emerald-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-600/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {!isCityLevel && <option value="">全部城市</option>}
            {visibleCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedParkType ?? ''}
          onChange={(e) => setParkType(e.target.value || null)}
          className="bg-emerald-950/50 border border-emerald-800/30 text-emerald-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-600/50"
        >
          <option value="">全部类型</option>
          {parkTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <span className="text-xs text-emerald-400/40 font-mono">{currentTime}</span>
      </div>
    </header>
  )
}
