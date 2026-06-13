import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Clock, XCircle, ChevronRight, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import type { Alert, ApprovalStep } from '@/types'

const statusStyles: Record<string, string> = {
  待处理: 'bg-zinc-500/20 text-zinc-400',
  已推送: 'bg-amber-500/20 text-amber-400',
  审批中: 'bg-blue-500/20 text-blue-400',
  已批准: 'bg-emerald-500/20 text-emerald-400',
  已解除: 'bg-zinc-600/20 text-zinc-500',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function StepIcon({ step }: { step: ApprovalStep }) {
  if (step.status === '已通过') {
    return <CheckCircle className="h-5 w-5 text-emerald-400" />
  }
  if (step.status === '已驳回') {
    return <XCircle className="h-5 w-5 text-red-400" />
  }
  return <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
}

function ApprovalModal({
  alert,
  onClose,
}: {
  alert: Alert
  onClose: () => void
}) {
  const approveAlertStep = useAppStore(s => s.approveAlertStep)
  const [remark, setRemark] = useState('')
  const currentStepIndex = alert.approvalChain.findIndex(s => s.status === '待审批')

  function handleApprove() {
    if (currentStepIndex === -1) return
    approveAlertStep(alert.id, currentStepIndex, remark)
    setRemark('')
    onClose()
  }

  function handleReject() {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-emerald-100">审批流程</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-emerald-500/60 transition-colors hover:text-emerald-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-0">
          {alert.approvalChain.map((step, i) => {
            const isLast = i === alert.approvalChain.length - 1
            const isCurrent = i === currentStepIndex
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <StepIcon step={step} />
                  {!isLast && (
                    <div
                      className={cn(
                        'h-full w-px',
                        step.status === '已通过' ? 'bg-emerald-600/40' : 'bg-emerald-800/20'
                      )}
                    />
                  )}
                </div>
                <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-200">{step.role}</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium',
                        step.status === '已通过'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : step.status === '已驳回'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {step.status}
                    </span>
                  </div>
                  {step.operator && (
                    <p className="mt-1 text-xs text-emerald-400/60">操作人: {step.operator}</p>
                  )}
                  {step.timestamp && (
                    <p className="mt-0.5 text-[10px] text-emerald-500/40">{formatDate(step.timestamp)}</p>
                  )}
                  {step.remark && (
                    <p className="mt-1 text-xs text-emerald-300/50">备注: {step.remark}</p>
                  )}
                  {isCurrent && (
                    <div className="mt-3 space-y-3 rounded-lg border border-emerald-800/15 bg-emerald-900/10 p-3">
                      <textarea
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                        placeholder="输入审批备注..."
                        className="w-full rounded-lg border border-emerald-800/20 bg-[#0A1A14] px-3 py-2 text-sm text-emerald-200 placeholder-emerald-600/40 outline-none focus:border-emerald-600/40"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleApprove}
                          className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                        >
                          通过
                        </button>
                        <button
                          onClick={handleReject}
                          className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
                        >
                          驳回
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AlertDetail({ alert }: { alert: Alert }) {
  const timeline: { label: string; time: string; desc: string }[] = [
    { label: '预警创建', time: alert.createdAt, desc: `系统自动生成${alert.type}` },
  ]
  if (alert.status !== '待处理') {
    timeline.push({ label: '预警推送', time: '', desc: '已推送至相关责任人' })
  }
  if (alert.approvalChain.length > 0) {
    alert.approvalChain.forEach(step => {
      if (step.status === '已通过') {
        timeline.push({
          label: `${step.role}审批通过`,
          time: step.timestamp || '',
          desc: step.remark || '',
        })
      }
    })
  }
  if (alert.status === '已批准') {
    timeline.push({ label: '审批完成', time: '', desc: '预警已批准，等待执行' })
  }
  if (alert.status === '已解除') {
    timeline.push({ label: '预警解除', time: '', desc: '预警已解除' })
  }

  return (
    <div className="border-t border-emerald-800/10 bg-[#0A1A14]/50 px-6 py-4">
      <div className="mb-3 text-xs font-semibold text-emerald-400/70">事件时间线</div>
      <div className="flex flex-col gap-0">
        {timeline.map((item, i) => {
          const isLast = i === timeline.length - 1
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
                {!isLast && <div className="h-full w-px bg-emerald-800/20" />}
              </div>
              <div className={cn('flex-1 pb-3', isLast && 'pb-0')}>
                <div className="text-sm text-emerald-200">{item.label}</div>
                {item.time && (
                  <div className="text-[10px] text-emerald-500/40">{formatDate(item.time)}</div>
                )}
                {item.desc && (
                  <div className="text-xs text-emerald-400/50">{item.desc}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Alerts() {
  const alertTab = useAppStore(s => s.alertTab)
  const setAlertTab = useAppStore(s => s.setAlertTab)
  const filteredAlerts = useAppStore(s => s.filteredAlerts)
  const alerts = useAppStore(s => s.alerts)
  const upgradeAlert = useAppStore(s => s.upgradeAlert)

  const [modalAlert, setModalAlert] = useState<Alert | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const level1Count = alerts.filter(a => a.type === '一级预警').length
  const level2Count = alerts.filter(a => a.type === '二级预警').length

  const tabs: { key: '一级预警' | '二级预警'; count: number }[] = [
    { key: '一级预警', count: level1Count },
    { key: '二级预警', count: level2Count },
  ]

  return (
    <div className="min-h-screen bg-[#0A1A14] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">预警管理</h1>
        <p className="text-emerald-400/60 text-sm">绿地异常预警与审批处理</p>
      </div>

      <div className="flex gap-6 border-b border-emerald-800/20 mb-5">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setAlertTab(tab.key)}
            className={cn(
              'relative pb-3 text-sm font-medium transition-colors',
              alertTab === tab.key
                ? 'text-emerald-400'
                : 'text-emerald-500/40 hover:text-emerald-400/60'
            )}
          >
            <span>{tab.key}</span>
            <span
              className={cn(
                'ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                alertTab === tab.key
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-900/20 text-emerald-500/40'
              )}
            >
              {tab.count}
            </span>
            {alertTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-emerald-800/20 bg-[#0D1B16]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-800/15 text-left">
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">预警编号</th>
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">公园名称</th>
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">预警原因</th>
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">预警时间</th>
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">状态</th>
              <th className="px-5 py-3 text-xs font-medium text-emerald-400/60">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map(alert => (
              <>
                <tr
                  key={alert.id}
                  onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                  className="cursor-pointer border-b border-emerald-800/10 bg-[#0D1B16] transition-colors hover:bg-emerald-900/20"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={cn(
                          'h-4 w-4',
                          alert.type === '一级预警' ? 'text-orange-400' : 'text-red-400'
                        )}
                      />
                      <span className="text-sm text-emerald-200/80">{alert.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/park/${alert.parkId}`}
                      onClick={e => e.stopPropagation()}
                      className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      {alert.parkName}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-emerald-200/70 line-clamp-1">{alert.reason}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-emerald-400/50">{formatDate(alert.createdAt)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'rounded px-2 py-0.5 text-[11px] font-medium',
                        statusStyles[alert.status]
                      )}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {alert.type === '一级预警' && alert.status === '已推送' && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            upgradeAlert(alert.id)
                          }}
                          className="rounded-lg bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-600/30"
                        >
                          升级预警
                        </button>
                      )}
                      {alert.type === '二级预警' && alert.status === '审批中' && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            setModalAlert(alert)
                          }}
                          className="rounded-lg bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-600/30"
                        >
                          审批
                        </button>
                      )}
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 text-emerald-500/30 transition-transform',
                          expandedId === alert.id && 'rotate-90'
                        )}
                      />
                    </div>
                  </td>
                </tr>
                {expandedId === alert.id && (
                  <tr key={`${alert.id}-detail`}>
                    <td colSpan={6} className="p-0">
                      <AlertDetail alert={alert} />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filteredAlerts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-emerald-500/40">
                  暂无预警数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAlert && (
        <ApprovalModal alert={modalAlert} onClose={() => setModalAlert(null)} />
      )}
    </div>
  )
}
