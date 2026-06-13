import { useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { provinces } from '@/data/mockData'

const pageNames: Record<string, string> = {
  '/': '核心看板',
  '/alerts': '预警管理',
  '/plan': '养护计划',
  '/reports': '诊断报告',
}

const parkTypes = ['综合公园', '社区公园', '专类公园', '带状公园']

export default function Header() {
  const location = useLocation()
  const selectedProvince = useAppStore((s) => s.selectedProvince)
  const setProvince = useAppStore((s) => s.setProvince)
  const selectedParkType = useAppStore((s) => s.selectedParkType)
  const setParkType = useAppStore((s) => s.setParkType)

  const pageName = location.pathname.startsWith('/park/')
    ? '公园详情'
    : pageNames[location.pathname] || '页面'

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-[#0D1B16] border-b border-emerald-900/30 z-40 flex items-center justify-between px-6">
      <div className="text-sm text-emerald-300/70">
        <span className="text-emerald-500/50">绿地智管</span>
        <span className="mx-2 text-emerald-700/40">/</span>
        <span className="text-emerald-200">{pageName}</span>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={selectedProvince ?? ''}
          onChange={(e) => setProvince(e.target.value || null)}
          className="bg-emerald-950/50 border border-emerald-800/30 text-emerald-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-600/50"
        >
          <option value="">全国</option>
          {provinces.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

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

        <span className="text-xs text-emerald-400/40 font-mono">2026-06-14 15:30</span>
      </div>
    </header>
  )
}
