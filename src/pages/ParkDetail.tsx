import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { ArrowLeft, Thermometer, Users, Droplets, Wifi, WifiOff } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

const areaColors = [
  { border: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { border: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
  { border: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
]

const costColors = ['#10b981', '#14b8a6', '#f59e0b', '#a855f7', '#f43f5e']

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(110,231,183,0.6)', font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#0D1B16',
      borderColor: 'rgba(16,185,129,0.3)',
      borderWidth: 1,
      titleColor: '#6ee7b7',
      bodyColor: '#a7f3d0',
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(16,185,129,0.08)' },
      ticks: { color: 'rgba(110,231,183,0.6)', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(16,185,129,0.08)' },
      ticks: { color: 'rgba(110,231,183,0.6)', font: { size: 11 } },
    },
  },
}

function CircularProgress({ value, max = 100, size = 80, strokeWidth = 6, color = '#10b981' }: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ParkDetail() {
  const { id } = useParams()
  const parks = useAppStore(s => s.parks)
  const park = useMemo(() => parks.find(p => p.id === id), [parks, id])

  const ndviChartData = useMemo(() => {
    if (!park) return null
    const labels = park.areas[0]?.ndviTrend.map(d => d.date.slice(5)) ?? []
    return {
      labels,
      datasets: park.areas.map((area, i) => ({
        label: area.name,
        data: area.ndviTrend.map(d => d.value),
        borderColor: areaColors[i % areaColors.length].border,
        backgroundColor: areaColors[i % areaColors.length].bg,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
      })),
    }
  }, [park])

  const soilChartData = useMemo(() => {
    if (!park || !park.areas[0]) return null
    const area = park.areas[0]
    const labels = area.soilData.map(d => d.timestamp.slice(5, 10))
    return {
      labels,
      datasets: [
        {
          label: '土壤含水量 (%)',
          data: area.soilData.map(d => d.moisture),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          tension: 0.3,
          pointRadius: 3,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: '土壤温度 (°C)',
          data: area.soilData.map(d => d.temperature),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          tension: 0.3,
          pointRadius: 3,
          fill: false,
          yAxisID: 'y1',
        },
      ],
    }
  }, [park])

  const costChartData = useMemo(() => {
    if (!park) return null
    const totals: Record<string, number> = {}
    park.areas.forEach(area => {
      area.cost.forEach(c => {
        totals[c.category] = (totals[c.category] || 0) + c.amount
      })
    })
    const categories = Object.keys(totals)
    return {
      labels: categories,
      datasets: [{
        data: categories.map(c => totals[c]),
        backgroundColor: costColors.slice(0, categories.length),
        borderColor: 'transparent',
        borderWidth: 0,
      }],
    }
  }, [park])

  const costLegend = useMemo(() => {
    if (!park) return []
    const totals: Record<string, number> = {}
    park.areas.forEach(area => {
      area.cost.forEach(c => {
        totals[c.category] = (totals[c.category] || 0) + c.amount
      })
    })
    return Object.entries(totals).map(([cat, amt], i) => ({
      category: cat,
      amount: amt,
      color: costColors[i % costColors.length],
    }))
  }, [park])

  if (!park) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1A14]">
        <div className="text-center">
          <p className="text-xl text-emerald-300/60">公园不存在</p>
          <Link to="/" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const latestSoilData = park.areas[0]?.soilData[park.areas[0].soilData.length - 1]

  const metricsList = [
    { label: '健康指数', value: park.metrics.healthIndex, unit: '分' },
    { label: '灌溉效率', value: park.metrics.irrigationEfficiency, unit: '%' },
    { label: '游客承载率', value: park.metrics.visitorCarryRate, unit: '%' },
    { label: '养护响应及时率', value: park.metrics.maintenanceResponseRate, unit: '%' },
  ]

  return (
    <div className="min-h-screen bg-[#0A1A14] p-6 space-y-5">
      <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-800/20 bg-emerald-900/20 text-emerald-400 transition-colors hover:bg-emerald-900/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{park.name}</h1>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                {park.type}
              </span>
            </div>
            <p className="mt-1 text-sm text-emerald-400/60">{park.city} · {park.province}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {metricsList.map(m => (
            <div
              key={m.label}
              className="rounded-lg border border-emerald-800/15 bg-emerald-900/10 px-4 py-3"
            >
              <div className="text-xs text-emerald-400/50">{m.label}</div>
              <div className="mt-1 text-lg font-semibold text-emerald-100">
                {m.value}<span className="ml-0.5 text-xs font-normal text-emerald-400/50">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
            <h3 className="mb-4 text-base font-semibold text-emerald-100">片区植被长势趋势（近7天）</h3>
            <div className="h-64">
              {ndviChartData && (
                <Line
                  data={ndviChartData}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        min: 0,
                        max: 1,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
            <h3 className="mb-4 text-base font-semibold text-emerald-100">土壤墒情变化趋势</h3>
            <div className="h-64">
              {soilChartData && (
                <Line
                  data={soilChartData}
                  options={{
                    ...chartOptions,
                    scales: {
                      x: chartOptions.scales.x,
                      y: {
                        ...chartOptions.scales.y,
                        position: 'left',
                        title: {
                          display: true,
                          text: '含水量 (%)',
                          color: 'rgba(110,231,183,0.5)',
                          font: { size: 11 },
                        },
                      },
                      y1: {
                        type: 'linear' as const,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: 'rgba(245,158,11,0.6)', font: { size: 11 } },
                        title: {
                          display: true,
                          text: '温度 (°C)',
                          color: 'rgba(245,158,11,0.5)',
                          font: { size: 11 },
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-5">
          <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
            <h3 className="mb-4 text-base font-semibold text-emerald-100">养护成本分布</h3>
            <div className="flex items-center justify-center" style={{ height: 200 }}>
              {costChartData && (
                <Doughnut
                  data={costChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#0D1B16',
                        borderColor: 'rgba(16,185,129,0.3)',
                        borderWidth: 1,
                        titleColor: '#6ee7b7',
                        bodyColor: '#a7f3d0',
                        callbacks: {
                          label: (ctx) => ` ¥${ctx.parsed.toLocaleString()}`,
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
            <div className="mt-4 space-y-2">
              {costLegend.map(item => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-emerald-300/70">{item.category}</span>
                  </div>
                  <span className="font-medium text-emerald-100">¥{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
            <h3 className="mb-4 text-base font-semibold text-emerald-100">实时监测数据</h3>

            <div className="flex items-center gap-4">
              <CircularProgress value={park.soilMoisture} max={100} size={80} strokeWidth={6} />
              <div>
                <div className="text-xs text-emerald-400/50">土壤含水量</div>
                <div className="text-2xl font-bold text-emerald-100">{park.soilMoisture}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-800/10 bg-emerald-900/10 px-4 py-3">
              <Thermometer className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-xs text-emerald-400/50">土壤温度</div>
                <div className="text-lg font-semibold text-emerald-100">
                  {latestSoilData?.temperature ?? '--'}°C
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-800/10 bg-emerald-900/10 px-4 py-3">
              <Users className="h-5 w-5 text-teal-400" />
              <div className="flex-1">
                <div className="text-xs text-emerald-400/50">游客数量</div>
                <div className="text-lg font-semibold text-emerald-100">{park.visitorDensity} 人</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-800/10 bg-emerald-900/10 px-4 py-3">
              <Droplets
                className={`h-5 w-5 ${park.visitorDensity > 200 ? 'text-rose-400' : 'text-cyan-400'}`}
              />
              <div>
                <div className="text-xs text-emerald-400/50">游客密度</div>
                <div
                  className={`text-lg font-semibold ${
                    park.visitorDensity > 200 ? 'text-rose-400' : 'text-emerald-100'
                  }`}
                >
                  {park.visitorDensity > 200 ? '密集' : '正常'}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-emerald-400/50 mb-2">灌溉设备状态</div>
              <div className="space-y-2">
                {[
                  { name: '灌溉设备-A01', online: true },
                  { name: '灌溉设备-A02', online: true },
                  { name: '灌溉设备-A03', online: false },
                ].map(device => (
                  <div
                    key={device.name}
                    className="flex items-center justify-between rounded-lg border border-emerald-800/10 bg-emerald-900/5 px-3 py-2"
                  >
                    <span className="text-sm text-emerald-200/80">{device.name}</span>
                    <span className="flex items-center gap-1.5 text-xs">
                      {device.online ? (
                        <>
                          <Wifi className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">在线</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3 text-rose-400" />
                          <span className="text-rose-400">离线</span>
                        </>
                      )}
                    </span>
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
