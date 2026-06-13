import { useState, useRef, useMemo, useEffect } from 'react'
import { Upload, CheckCircle, Calendar, Droplets, Scissors, Sparkles } from 'lucide-react'
import * as XLSX from 'xlsx'
import { maintenancePlans } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { MaintenanceNode, MaintenancePlan as MaintenancePlanType, Recommendation } from '@/types'

const statusStyles: Record<string, string> = {
  待执行: 'bg-zinc-500/20 text-zinc-400',
  进行中: 'bg-amber-500/20 text-amber-400',
  已完成: 'bg-emerald-500/20 text-emerald-400',
}

const riskLevelStyles: Record<number, string> = {
  1: 'bg-emerald-900/30 text-emerald-400',
  2: 'bg-green-800/40 text-green-300',
  3: 'bg-amber-900/40 text-amber-400',
  4: 'bg-orange-900/50 text-orange-400',
  5: 'bg-red-900/60 text-red-400',
}

const riskLevelTextColors: Record<number, string> = {
  1: 'text-emerald-400',
  2: 'text-green-300',
  3: 'text-amber-400',
  4: 'text-orange-400',
  5: 'text-red-400',
}

const riskLevelDescriptions: Record<number, string> = {
  1: '低风险 - 植被生长状态良好',
  2: '较低风险 - 植被生长状态稳定',
  3: '中等风险 - 需关注植被生长变化',
  4: '较高风险 - 建议采取养护措施',
  5: '高风险 - 需立即采取干预措施',
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

function RecommendationBadge({ type }: { type: Recommendation['type'] }) {
  const isWater = type === '浇灌频次'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium',
        isWater ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
      )}
    >
      {isWater ? <Droplets className="h-3 w-3" /> : <Scissors className="h-3 w-3" />}
      {type}
    </span>
  )
}

export default function MaintenancePlan() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [plan, setPlan] = useState<MaintenancePlanType>(maintenancePlans[0])
  const [isDragOver, setIsDragOver] = useState(false)
  const [hoveredRiskDate, setHoveredRiskDate] = useState<string | null>(null)

  useEffect(() => {
    if (uploading) {
      const startTime = Date.now()
      const duration = 1500
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(100, (elapsed / duration) * 100)
        setUploadProgress(progress)
        if (progress < 100) {
          requestAnimationFrame(animate)
        } else {
          setUploading(false)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [uploading])

  const calendarWeeks = useMemo(() => {
    const data = plan.riskPrediction
    const weeks: { date: string; riskLevel: number; dayOfMonth: number }[][] = []
    let currentWeek: { date: string; riskLevel: number; dayOfMonth: number }[] = []
    
    const firstDate = new Date(data[0].date)
    const firstDay = firstDate.getDay()
    const offset = firstDay === 0 ? 6 : firstDay - 1
    
    for (let i = 0; i < offset; i++) {
      currentWeek.push({ date: '', riskLevel: 0, dayOfMonth: 0 })
    }
    
    data.forEach((item) => {
      const d = new Date(item.date)
      currentWeek.push({
        date: item.date,
        riskLevel: item.riskLevel,
        dayOfMonth: d.getDate(),
      })
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', riskLevel: 0, dayOfMonth: 0 })
      }
      weeks.push(currentWeek)
    }
    
    return weeks
  }, [plan.riskPrediction])

  function handleFileSelect(selectedFile: File) {
    if (!selectedFile) return
    
    setFile(selectedFile)
    setUploading(true)
    setUploadProgress(0)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const nodes: MaintenanceNode[] = jsonData.map((row) => {
          const rowRecord = row as Record<string, unknown>
          const area = String(rowRecord['区域'] || rowRecord['区域名称'] || rowRecord['area'] || '未知区域')
          const task = String(rowRecord['任务'] || rowRecord['任务名称'] || rowRecord['task'] || '未知任务')
          const plannedDate = String(rowRecord['计划日期'] || rowRecord['日期'] || rowRecord['plannedDate'] || '2026-06-15')
          const status = String(rowRecord['状态'] || rowRecord['status'] || '待执行')
          return {
            area,
            task,
            plannedDate,
            status: (status === '待执行' || status === '进行中' || status === '已完成')
              ? status as MaintenanceNode['status']
              : '待执行',
          }
        })
        
        if (nodes.length === 0) {
          nodes.push(...maintenancePlans[0].nodes)
        }
        
        setTimeout(() => {
          setPlan(prev => ({
            ...prev,
            fileName: selectedFile.name,
            uploadDate: new Date().toISOString().slice(0, 10),
            nodes,
          }))
        }, 1500)
      } catch {
        setTimeout(() => {
          setPlan(prev => ({
            ...prev,
            fileName: selectedFile.name,
            uploadDate: new Date().toISOString().slice(0, 10),
          }))
        }, 1500)
      }
    }
    reader.readAsArrayBuffer(selectedFile)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      handleFileSelect(droppedFile)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleClick() {
    fileInputRef.current?.click()
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-[#0A1A14] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">养护计划</h1>
        <p className="text-emerald-400/60 text-sm">养护任务排期与智能推荐</p>
      </div>

      <div className="space-y-6">
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'cursor-pointer rounded-xl border-2 border-dashed bg-[#0D1B16] p-10 text-center transition-colors',
            isDragOver
              ? 'border-emerald-500 bg-emerald-900/20'
              : 'border-emerald-600/40 hover:border-emerald-500/60'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleInputChange}
          />
          
          {!file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/30">
                <Upload className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-100">上传年度养护计划</h3>
              <p className="text-sm text-emerald-400/50">
                支持 .xlsx / .xls 格式，系统将自动解析养护节点并生成智能推荐
              </p>
            </div>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/30">
                <Upload className="h-8 w-8 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-100">正在上传...</h3>
              <div className="w-full max-w-md">
                <div className="h-2 overflow-hidden rounded-full bg-emerald-900/30">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-100"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-emerald-400/50">
                  {file.name} - {Math.round(uploadProgress)}%
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/30">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-100">上传成功</h3>
              <div className="text-sm text-emerald-400/60">
                <span className="font-medium text-emerald-300">{file.name}</span>
                <span className="mx-2">·</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <p className="text-xs text-emerald-400/40">
                点击重新上传
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-100">
            <Calendar className="h-5 w-5 text-emerald-500" />
            养护节点明细
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-emerald-800/15 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-emerald-400/60">区域</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-400/60">任务</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-400/60">计划日期</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-400/60">状态</th>
                </tr>
              </thead>
              <tbody>
                {plan.nodes.map((node, index) => (
                  <tr
                    key={index}
                    className={cn(
                      'border-b border-emerald-800/10 transition-colors hover:bg-emerald-900/10',
                      index % 2 === 0 ? 'bg-[#0D1B16]' : 'bg-[#0A1A14]/30'
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-emerald-200/80">{node.area}</td>
                    <td className="px-4 py-3 text-sm text-emerald-200/80">{node.task}</td>
                    <td className="px-4 py-3 text-sm text-emerald-400/60">{node.plannedDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-[11px] font-medium',
                          statusStyles[node.status]
                        )}
                      >
                        {node.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {plan.nodes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-emerald-500/40">
                      暂无养护节点数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-100">
            <Sparkles className="h-5 w-5 text-amber-500" />
            未来90天绿地生长风险预测
          </h2>
          
          <div className="mb-3 grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[11px] font-medium text-emerald-400/60">
                {day}
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="relative flex h-8 w-full items-center justify-center rounded text-[11px] font-medium"
                    onMouseEnter={() => day.date && setHoveredRiskDate(day.date)}
                    onMouseLeave={() => setHoveredRiskDate(null)}
                  >
                    {day.date ? (
                      <div
                        className={cn(
                          'flex h-8 w-full items-center justify-center rounded transition-transform hover:scale-105',
                          riskLevelStyles[day.riskLevel]
                        )}
                      >
                        {day.dayOfMonth}
                      </div>
                    ) : (
                      <div className="h-8 w-full" />
                    )}
                    
                    {hoveredRiskDate === day.date && day.date && (
                      <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-emerald-800/20 bg-[#0D1B16] px-3 py-2 shadow-lg">
                        <div className="text-sm font-medium text-emerald-200">{day.date}</div>
                        <div className={cn('text-xs', riskLevelTextColors[day.riskLevel])}>
                          风险等级 {day.riskLevel}
                        </div>
                        <div className="mt-1 text-xs text-emerald-400/60">
                          {riskLevelDescriptions[day.riskLevel]}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4">
            {[1, 2, 3, 4, 5].map(level => (
              <div key={level} className="flex items-center gap-1.5">
                <div className={cn('h-4 w-4 rounded', riskLevelStyles[level])} />
                <span className="text-[10px] text-emerald-400/50">
                  {level === 1 ? '低' : level === 2 ? '较低' : level === 3 ? '中' : level === 4 ? '较高' : '高'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-100">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            智能养护方案推荐
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {plan.recommendations.map((rec, index) => (
              <div
                key={index}
                className="rounded-lg border border-emerald-800/20 bg-[#0A1A14]/50 p-4 transition-colors hover:border-emerald-700/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <RecommendationBadge type={rec.type} />
                  <span className="text-xs font-semibold text-emerald-400">
                    {Math.round(rec.confidence * 100)}% 置信度
                  </span>
                </div>
                
                <p className="mb-3 text-sm text-emerald-200/80">
                  {rec.description}
                </p>
                
                <div className="mb-3 text-xs text-emerald-400/60">
                  适用区域：<span className="text-emerald-300">{rec.applicableArea}</span>
                </div>
                
                <div className="h-1.5 overflow-hidden rounded-full bg-emerald-900/20">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      rec.type === '浇灌频次' ? 'bg-blue-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${rec.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
