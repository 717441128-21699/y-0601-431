import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import {
  Download,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Megaphone,
  Star,
  Search,
} from 'lucide-react'
import { weeklyReports } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { WeeklyReport } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function getHealthIndex(report: WeeklyReport): number {
  return +(80 + report.healthIndexYoY * 0.7).toFixed(1)
}

function getReportDate(weekStr: string): string {
  const match = weekStr.match(/(\d+)年第(\d+)周/)
  if (!match) return '2026-06-09'
  const year = parseInt(match[1])
  const week = parseInt(match[2])
  const d = new Date(year, 0, 1 + (week - 1) * 7)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const satisfactionBreakdown = [
  { label: '环境清洁', value: 89 },
  { label: '设施完善', value: 85 },
  { label: '景观美观', value: 91 },
  { label: '服务态度', value: 84 },
]

const promotionSuggestions = [
  { title: '暑期亲子活动推广', desc: '建议在暑期推出亲子绿植科普活动，结合线上短视频宣传，预计可提升周末客流20%以上' },
  { title: '社区联动宣传方案', desc: '与周边社区合作开展"绿地养护体验日"活动，增强市民参与感和环保意识' },
  { title: '数字化导览升级', desc: '优化小程序导览功能，增加AR植物识别和语音讲解，提升游客游览体验' },
]

export default function Reports() {
  const [selectedId, setSelectedId] = useState<string>(weeklyReports[0].id)
  const [searchText, setSearchText] = useState('')
  const [suggestionTab, setSuggestionTab] = useState<'养护' | '宣传'>('养护')

  const filteredReports = useMemo(() => {
    if (!searchText.trim()) return weeklyReports
    return weeklyReports.filter(r => r.week.includes(searchText.trim()))
  }, [searchText])

  const selectedReport = useMemo(
    () => weeklyReports.find(r => r.id === selectedId) || weeklyReports[0],
    [selectedId]
  )

  const healthIndex = getHealthIndex(selectedReport)

  const yoyChartData = useMemo(() => {
    const lastYear = +(healthIndex - selectedReport.healthIndexYoY).toFixed(1)
    return {
      labels: ['去年同期', '本周'],
      datasets: [
        {
          data: [lastYear, healthIndex],
          backgroundColor: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.7)'],
          borderColor: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 1)'],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }
  }, [selectedReport, healthIndex])

  const momChartData = useMemo(() => {
    const lastWeek = +(healthIndex - selectedReport.healthIndexMoM).toFixed(1)
    return {
      labels: ['上周', '本周'],
      datasets: [
        {
          data: [lastWeek, healthIndex],
          backgroundColor: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.7)'],
          borderColor: ['rgba(16, 185, 129, 0.5)', 'rgba(16, 185, 129, 1)'],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }
  }, [selectedReport, healthIndex])

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13, 27, 22, 0.95)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        titleColor: '#d1fae5',
        bodyColor: '#6ee7b7',
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(16, 185, 129, 0.5)', font: { size: 10 } },
      },
      y: {
        min: Math.floor(healthIndex - 8),
        max: Math.ceil(healthIndex + 4),
        grid: { color: 'rgba(16, 185, 129, 0.1)' },
        ticks: { color: 'rgba(16, 185, 129, 0.5)', font: { size: 10 } },
      },
    },
  }

  const costChartData = useMemo(() => {
    return {
      labels: selectedReport.costTrend.map(c => c.week),
      datasets: [
        {
          label: '养护成本',
          data: selectedReport.costTrend.map(c => +(c.amount / 10000).toFixed(2)),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#0D1B16',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [selectedReport])

  const costOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13, 27, 22, 0.95)',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        titleColor: '#d1fae5',
        bodyColor: '#6ee7b7',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context: any) => `养护成本: ${context.parsed.y}万元`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(16, 185, 129, 0.5)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(16, 185, 129, 0.1)' },
        ticks: {
          color: 'rgba(16, 185, 129, 0.5)',
          font: { size: 11 },
          callback: (value: any) => `${value}万`,
        },
      },
    },
  }

  const satisfactionScore = selectedReport.visitorSatisfaction
  const starCount = Math.floor(satisfactionScore / 20)
  const partialStar = (satisfactionScore % 20) / 20

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (satisfactionScore / 100) * circumference

  return (
    <div className="min-h-screen bg-[#0A1A14] p-6">
      <div className="flex h-[calc(100vh-120px)] gap-6">
        <div className="flex w-80 flex-col overflow-hidden rounded-xl border border-emerald-800/20 bg-[#0D1B16]">
          <div className="border-b border-emerald-800/20 p-5">
            <h2 className="text-lg font-semibold text-emerald-100">诊断报告列表</h2>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/40" />
              <input
                type="text"
                placeholder="搜索周次..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full rounded-lg border border-emerald-800/20 bg-[#0A1A14] py-2 pl-9 pr-3 text-sm text-emerald-200 placeholder-emerald-600/40 outline-none focus:border-emerald-600/40"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {filteredReports.map(report => {
              const isSelected = report.id === selectedId
              const hi = getHealthIndex(report)
              const reportDate = getReportDate(report.week)
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedId(report.id)}
                  className={cn(
                    'mb-2 cursor-pointer rounded-lg border-l-2 p-4 transition-all',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-transparent hover:bg-emerald-900/10'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-emerald-100">{report.week}</div>
                      <div className="mt-1 text-xs text-emerald-500/60">生成于 {reportDate}</div>
                    </div>
                    <div className="flex h-8 min-w-[48px] items-center justify-center rounded-md bg-emerald-500/20 px-2">
                      <span className="text-sm font-bold text-emerald-400">{hi}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredReports.length === 0 && (
              <div className="py-12 text-center text-sm text-emerald-500/40">
                未找到匹配的报告
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedReport.week} 绿地养护诊断报告
              </h1>
              <p className="mt-1 text-sm text-emerald-400/60">
                生成时间：2026-06-14 10:00
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500">
              <Download className="h-4 w-4" />
              下载PDF
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
              <div className="text-sm text-emerald-400/70">健康指数</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-emerald-300">{healthIndex}</span>
                <span className="text-sm text-emerald-500/60">分</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-500/60">同比</span>
                  <span className={cn(
                    'flex items-center gap-1 font-medium',
                    selectedReport.healthIndexYoY >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {selectedReport.healthIndexYoY >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {selectedReport.healthIndexYoY >= 0 ? '+' : ''}
                    {selectedReport.healthIndexYoY}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-500/60">环比</span>
                  <span className={cn(
                    'flex items-center gap-1 font-medium',
                    selectedReport.healthIndexMoM >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {selectedReport.healthIndexMoM >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {selectedReport.healthIndexMoM >= 0 ? '+' : ''}
                    {selectedReport.healthIndexMoM}%
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-emerald-400/70">同比分析</div>
                <span className={cn(
                  'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                  selectedReport.healthIndexYoY >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                )}>
                  {selectedReport.healthIndexYoY >= 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {selectedReport.healthIndexYoY >= 0 ? '+' : ''}
                  {selectedReport.healthIndexYoY}%
                </span>
              </div>
              <div className="mt-3 h-32">
                <Bar data={yoyChartData} options={barOptions as any} />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-emerald-400/70">环比分析</div>
                <span className={cn(
                  'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                  selectedReport.healthIndexMoM >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                )}>
                  {selectedReport.healthIndexMoM >= 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {selectedReport.healthIndexMoM >= 0 ? '+' : ''}
                  {selectedReport.healthIndexMoM}%
                </span>
              </div>
              <div className="mt-3 h-32">
                <Bar data={momChartData} options={barOptions as any} />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-emerald-100">养护成本趋势</h3>
              <span className="text-xs text-emerald-500/50">单位：万元</span>
            </div>
            <div className="h-64">
              <Line data={costChartData} options={costOptions as any} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5">
            <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
              <h3 className="mb-5 text-base font-semibold text-emerald-100">游客满意度</h3>
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="180" height="180" className="-rotate-90">
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="rgba(16, 185, 129, 0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="url(#satisfactionGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                    <defs>
                      <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-300">{satisfactionScore}</span>
                    <span className="text-xs text-emerald-500/60">满分 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => {
                      const fillAmount = i <= starCount ? 1 : i === starCount + 1 ? partialStar : 0
                      return (
                        <div key={i} className="relative h-5 w-5">
                          <Star
                            className="absolute inset-0 h-5 w-5 text-emerald-800/30"
                            fill="currentColor"
                          />
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillAmount * 100}%` }}
                          >
                            <Star
                              className="h-5 w-5 text-amber-400"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-sm text-emerald-300/70">
                    游客整体满意度较高，建议继续保持服务品质
                  </p>
                  <div className="mt-4 space-y-2">
                    {satisfactionBreakdown.map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-16 text-xs text-emerald-500/60">{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-emerald-900/30">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs font-medium text-emerald-400">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
              <h3 className="mb-4 text-base font-semibold text-emerald-100">优化建议与宣传方案</h3>
              <div className="mb-4 flex gap-1 rounded-lg bg-emerald-900/20 p-1">
                <button
                  onClick={() => setSuggestionTab('养护')}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
                    suggestionTab === '养护'
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'text-emerald-500/50 hover:text-emerald-400/70'
                  )}
                >
                  养护建议
                </button>
                <button
                  onClick={() => setSuggestionTab('宣传')}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
                    suggestionTab === '宣传'
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'text-emerald-500/50 hover:text-emerald-400/70'
                  )}
                >
                  宣传建议
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {suggestionTab === '养护'
                  ? selectedReport.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex gap-3 rounded-lg border border-emerald-800/15 bg-emerald-900/10 p-3"
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                          <Lightbulb className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-emerald-200">
                            建议 {i + 1}
                          </div>
                          <p className="mt-1 text-xs text-emerald-400/60 leading-relaxed">{s}</p>
                        </div>
                      </div>
                    ))
                  : promotionSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex gap-3 rounded-lg border border-emerald-800/15 bg-emerald-900/10 p-3"
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                          <Megaphone className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-emerald-200">{s.title}</div>
                          <p className="mt-1 text-xs text-emerald-400/60 leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
