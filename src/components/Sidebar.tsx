import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, AlertTriangle, ClipboardList, FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { UserRole } from '@/types'
import { cn } from '@/lib/utils'

const roles: { value: UserRole; label: string }[] = [
  { value: '国家级', label: '国家级' },
  { value: '省级', label: '省级' },
  { value: '市级', label: '市级' },
]

export default function Sidebar() {
  const currentUser = useAppStore((s) => s.currentUser)
  const setCurrentRole = useAppStore((s) => s.setCurrentRole)
  const selectedParkId = useAppStore((s) => s.selectedParkId)
  const location = useLocation()
  const navigate = useNavigate()

  const parkDetailActive = location.pathname.startsWith('/park/')

  const getJurisdiction = (): string => {
    if (currentUser.role === '国家级') return '全国范围'
    if (currentUser.role === '省级' && currentUser.province) return `${currentUser.province}省`
    if (currentUser.role === '市级' && currentUser.city && currentUser.province)
      return `${currentUser.city}市 - ${currentUser.province}`
    return currentUser.role
  }

  const handleRoleChange = (role: UserRole) => {
    if (role === '国家级') {
      setCurrentRole('国家级')
    } else if (role === '省级') {
      setCurrentRole('省级', '广东')
    } else if (role === '市级') {
      setCurrentRole('市级', '广东', '广州')
    }
  }

  const parkDetailTo = selectedParkId ? `/park/${selectedParkId}` : '#'
  const parkDetailDisabled = !selectedParkId

  const getAvatarText = () => {
    if (currentUser.role === '国家级') return '国'
    if (currentUser.role === '省级') return '省'
    if (currentUser.role === '市级') return '市'
    return '管'
  }

  const getUserName = () => {
    if (currentUser.role === '国家级') return '国家管理员'
    if (currentUser.role === '省级') return '省级管理员'
    if (currentUser.role === '市级') return '市级管理员'
    return '系统管理员'
  }

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
        <NavLink
          key="核心看板"
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-emerald-900/40 text-emerald-400 border-l-2 border-emerald-500'
                : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-l-2 border-transparent'
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>核心看板</span>
        </NavLink>

        <div
          key="公园详情"
          onClick={() => {
            if (!parkDetailDisabled && selectedParkId) {
              navigate(`/park/${selectedParkId}`)
            }
          }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-l-2',
            parkDetailDisabled
              ? 'text-emerald-200/30 cursor-not-allowed border-transparent'
              : parkDetailActive
                ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500 cursor-pointer'
                : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-transparent cursor-pointer'
          )}
        >
          <MapPin size={18} />
          <span>公园详情</span>
        </div>

        <NavLink
          key="预警管理"
          to="/alerts"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-emerald-900/40 text-emerald-400 border-l-2 border-emerald-500'
                : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-l-2 border-transparent'
            }`
          }
        >
          <AlertTriangle size={18} />
          <span>预警管理</span>
        </NavLink>

        <NavLink
          key="养护计划"
          to="/plan"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-emerald-900/40 text-emerald-400 border-l-2 border-emerald-500'
                : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-l-2 border-transparent'
            }`
          }
        >
          <ClipboardList size={18} />
          <span>养护计划</span>
        </NavLink>

        <NavLink
          key="诊断报告"
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-emerald-900/40 text-emerald-400 border-l-2 border-emerald-500'
                : 'text-emerald-200/60 hover:bg-emerald-900/20 hover:text-emerald-300 border-l-2 border-transparent'
            }`
          }
        >
          <FileText size={18} />
          <span>诊断报告</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-emerald-900/30 space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] text-emerald-400/50 uppercase tracking-wider">角色切换</p>
          <div className="flex gap-1">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleChange(role.value)}
                className={`flex-1 py-1.5 text-[10px] rounded-md transition-colors ${
                  currentUser.role === role.value
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-emerald-950/30 text-emerald-400/60 border border-emerald-800/30 hover:bg-emerald-900/30 hover:text-emerald-300'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300 text-xs font-bold">
            {getAvatarText()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-200/70 truncate">{getUserName()}</p>
            <p className="text-[10px] text-emerald-500/60 truncate">{getJurisdiction()}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-400 border border-emerald-700/30">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
