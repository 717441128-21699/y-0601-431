import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MapPin, AlertTriangle, ClipboardList, FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '核心看板' },
  { to: '#', icon: MapPin, label: '公园详情' },
  { to: '/alerts', icon: AlertTriangle, label: '预警管理' },
  { to: '/plan', icon: ClipboardList, label: '养护计划' },
  { to: '/reports', icon: FileText, label: '诊断报告' },
]

export default function Sidebar() {
  const currentUser = useAppStore((s) => s.currentUser)

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#0D1B16] border-r border-[#1B4332] flex flex-col z-50">
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌿</span>
          <span className="text-lg font-bold text-white">绿地智管</span>
        </div>
        <p className="text-xs text-emerald-400/60 mt-1 ml-[34px]">园林养护智能分析平台</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-emerald-900/40 text-emerald-400 border-l-2 border-emerald-500'
                  : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-l-2 border-transparent'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-900/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300 text-xs font-bold">
            管
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-200/70 truncate">系统管理员</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-400 border border-emerald-700/30">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
