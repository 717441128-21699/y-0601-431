import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Droplets, Users, Clock, AlertTriangle, MapPin } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import ChinaMap from '@/components/ChinaMap'
import EfficiencyRanking from '@/components/EfficiencyRanking'

const baselines = {
  healthIndex: 78.5,
  irrigationEfficiency: 82.0,
  visitorCarryRate: 68.0,
  maintenanceResponseRate: 86.0,
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Dashboard() {
  const filteredParks = useAppStore(s => s.filteredParks)
  const visibleAlerts = useAppStore(s => s.visibleAlerts)
  const selectedProvince = useAppStore(s => s.selectedProvince)
  const selectedCity = useAppStore(s => s.selectedCity)
  const selectedParkType = useAppStore(s => s.selectedParkType)

  const metrics = useMemo(() => {
    if (filteredParks.length === 0) {
      return {
        healthIndex: 0,
        irrigationEfficiency: 0,
        visitorCarryRate: 0,
        maintenanceResponseRate: 0,
      }
    }
    const sum = filteredParks.reduce(
      (acc, p) => ({
        healthIndex: acc.healthIndex + p.metrics.healthIndex,
        irrigationEfficiency: acc.irrigationEfficiency + p.metrics.irrigationEfficiency,
        visitorCarryRate: acc.visitorCarryRate + p.metrics.visitorCarryRate,
        maintenanceResponseRate: acc.maintenanceResponseRate + p.metrics.maintenanceResponseRate,
      }),
      { healthIndex: 0, irrigationEfficiency: 0, visitorCarryRate: 0, maintenanceResponseRate: 0 }
    )
    const n = filteredParks.length
    return {
      healthIndex: sum.healthIndex / n,
      irrigationEfficiency: sum.irrigationEfficiency / n,
      visitorCarryRate: sum.visitorCarryRate / n,
      maintenanceResponseRate: sum.maintenanceResponseRate / n,
    }
  }, [filteredParks])

  const trends = useMemo(() => ({
    healthIndex: ((metrics.healthIndex - baselines.healthIndex) / baselines.healthIndex) * 100,
    irrigationEfficiency: ((metrics.irrigationEfficiency - baselines.irrigationEfficiency) / baselines.irrigationEfficiency) * 100,
    visitorCarryRate: ((metrics.visitorCarryRate - baselines.visitorCarryRate) / baselines.visitorCarryRate) * 100,
    maintenanceResponseRate: ((metrics.maintenanceResponseRate - baselines.maintenanceResponseRate) / baselines.maintenanceResponseRate) * 100,
  }), [metrics])

  function trendDir(val: number): 'up' | 'down' | 'stable' {
    if (val > 0.05) return 'up'
    if (val < -0.05) return 'down'
    return 'stable'
  }

  const level1Count = visibleAlerts.filter(a => a.type === '一级预警').length
  const level2Count = visibleAlerts.filter(a => a.type === '二级预警').length
  const recentAlerts = [...visibleAlerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0A1A14] p-6">
      <div className="grid grid-cols-4 gap-5">
        <MetricCard
          title="绿地健康指数"
          value={metrics.healthIndex.toFixed(1)}
          unit="分"
          icon={<Leaf className="h-5 w-5" />}
          color="from-emerald-600/20 to-emerald-800/10"
          trend={trendDir(trends.healthIndex)}
          trendValue={`${trends.healthIndex >= 0 ? '+' : ''}${trends.healthIndex.toFixed(1)}%`}
        />
        <MetricCard
          title="灌溉效率"
          value={metrics.irrigationEfficiency.toFixed(1)}
          unit="%"
          icon={<Droplets className="h-5 w-5" />}
          color="from-blue-600/20 to-blue-800/10"
          trend={trendDir(trends.irrigationEfficiency)}
          trendValue={`${trends.irrigationEfficiency >= 0 ? '+' : ''}${trends.irrigationEfficiency.toFixed(1)}%`}
        />
        <MetricCard
          title="游客承载率"
          value={metrics.visitorCarryRate.toFixed(1)}
          unit="%"
          icon={<Users className="h-5 w-5" />}
          color="from-amber-600/20 to-amber-800/10"
          trend={trendDir(trends.visitorCarryRate)}
          trendValue={`${trends.visitorCarryRate >= 0 ? '+' : ''}${trends.visitorCarryRate.toFixed(1)}%`}
        />
        <MetricCard
          title="养护响应及时率"
          value={metrics.maintenanceResponseRate.toFixed(1)}
          unit="%"
          icon={<Clock className="h-5 w-5" />}
          color="from-purple-600/20 to-purple-800/10"
          trend={trendDir(trends.maintenanceResponseRate)}
          trendValue={`${trends.maintenanceResponseRate >= 0 ? '+' : ''}${trends.maintenanceResponseRate.toFixed(1)}%`}
        />
      </div>

      <div className="mt-5 flex gap-5">
        <div className="flex-[2]">
          <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-800/20 bg-[#0D1B16] px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-emerald-200/80">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>当前范围：</span>
              <span className="font-medium text-emerald-100">
                {selectedProvince || '全国'}
                {selectedCity ? ` / ${selectedCity}` : ''}
                {selectedParkType ? ` / ${selectedParkType}` : ''}
              </span>
            </div>
            <div className="text-sm text-emerald-400/60">
              共 <span className="font-medium text-emerald-300">{filteredParks.length}</span> 个公园
            </div>
          </div>
          <ChinaMap />
        </div>
        <div className="flex-[1]">
          <EfficiencyRanking />
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
          <h3 className="mb-4 text-base font-semibold text-emerald-100">公园列表（点击查看详情）</h3>
          <div className="grid grid-cols-4 gap-4">
            {filteredParks.map(park => (
              <Link
                key={park.id}
                to={`/park/${park.id}`}
                className="rounded-lg border border-emerald-800/20 bg-[#0D1B16] p-4 transition-all hover:border-emerald-600/40 hover:shadow-lg"
              >
                <h4 className="text-sm font-semibold text-emerald-100">{park.name}</h4>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs text-emerald-400/60">{park.city}</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                    {park.type}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-emerald-500/50">健康指数</div>
                    <div
                      className={cn(
                        'text-base font-bold',
                        park.metrics.healthIndex > 80
                          ? 'text-emerald-400'
                          : park.metrics.healthIndex >= 60
                            ? 'text-amber-400'
                            : 'text-red-400'
                      )}
                    >
                      {park.metrics.healthIndex.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-500/50">灌溉效率</div>
                    <div className="text-base font-bold text-blue-400">
                      {park.metrics.irrigationEfficiency.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-500/50">游客承载率</div>
                    <div className="text-base font-bold text-amber-400">
                      {park.metrics.visitorCarryRate.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-500/50">养护响应率</div>
                    <div className="text-base font-bold text-purple-400">
                      {park.metrics.maintenanceResponseRate.toFixed(1)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-xl border border-emerald-800/20 bg-[#0D1B16] p-5">
          <h3 className="mb-4 text-base font-semibold text-emerald-100">预警概览</h3>

          <div className="flex gap-4">
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-orange-500/20 bg-orange-900/10 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div>
                <div className="text-xs text-orange-300/70">一级预警</div>
                <div className="text-2xl font-bold text-orange-400">{level1Count}</div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-red-500/20 bg-red-900/10 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-xs text-red-300/70">二级预警</div>
                <div className="text-2xl font-bold text-red-400">{level2Count}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {recentAlerts.map(alert => (
              <Link
                key={alert.id}
                to="/alerts"
                className="flex items-center gap-3 rounded-lg border border-emerald-800/10 bg-emerald-900/10 px-4 py-3 transition-colors hover:bg-emerald-900/20"
              >
                <span className="text-sm text-emerald-200/80">{alert.parkName}</span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                    alert.type === '一级预警'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-red-500/20 text-red-400'
                  )}
                >
                  {alert.type}
                </span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                    alert.status === '待处理'
                      ? 'bg-gray-500/20 text-gray-400'
                      : alert.status === '已推送'
                        ? 'bg-blue-500/20 text-blue-400'
                        : alert.status === '审批中'
                          ? 'bg-amber-500/20 text-amber-400'
                          : alert.status === '已批准'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-emerald-700/20 text-emerald-600'
                  )}
                >
                  {alert.status}
                </span>
                <span className="flex-1 truncate text-xs text-emerald-400/50">{alert.reason}</span>
                <span className="flex-shrink-0 text-[10px] text-emerald-500/40">
                  {formatTime(alert.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
