import { create } from 'zustand'
import type { User, UserRole, ParkData, Alert, ApprovalStep } from '@/types'
import { defaultUser, parks as mockParks, alerts as mockAlerts, generateAlertFromPark, alertThresholds } from '@/data/mockData'

interface AppState {
  currentUser: User
  selectedProvince: string | null
  selectedCity: string | null
  selectedParkType: string | null
  selectedParkId: string | null
  alertTab: '一级预警' | '二级预警'
  selectedReportId: string | null
  parks: ParkData[]
  alerts: Alert[]
  visibleParks: ParkData[]
  filteredParks: ParkData[]
  visibleAlerts: Alert[]
  filteredAlerts: Alert[]
  visibleProvinces: string[]
  visibleCities: string[]
  setCurrentRole: (role: UserRole, province?: string, city?: string) => void
  setProvince: (province: string | null) => void
  setCity: (city: string | null) => void
  setParkType: (type: string | null) => void
  selectPark: (id: string | null) => void
  setAlertTab: (tab: '一级预警' | '二级预警') => void
  selectReport: (id: string | null) => void
  generateAutoAlerts: () => void
  checkAndUpgradeAlerts: () => void
  approveAlertStep: (alertId: string, stepIndex: number, remark: string) => void
  upgradeAlert: (alertId: string) => void
  pushAlert: (alertId: string) => void
}

function computeVisibleParks(parks: ParkData[], user: User): ParkData[] {
  if (user.role === '国家级') {
    return parks
  }
  if (user.role === '省级' && user.province) {
    return parks.filter(p => p.province === user.province)
  }
  if (user.role === '市级' && user.city) {
    return parks.filter(p => p.city === user.city)
  }
  if (user.role === '区绿化办' && user.district) {
    return parks.filter(p => p.city === user.city)
  }
  return []
}

function computeVisibleAlerts(alerts: Alert[], visibleParkIds: string[]): Alert[] {
  return alerts.filter(a => visibleParkIds.includes(a.parkId))
}

function computeVisibleProvinces(visibleParks: ParkData[]): string[] {
  return [...new Set(visibleParks.map(p => p.province))]
}

function computeVisibleCities(visibleParks: ParkData[]): string[] {
  return [...new Set(visibleParks.map(p => p.city))]
}

function computeFilteredParks(
  visibleParks: ParkData[],
  province: string | null,
  city: string | null,
  type: string | null,
): ParkData[] {
  return visibleParks.filter(p =>
    (province === null || p.province === province) &&
    (city === null || p.city === city) &&
    (type === null || p.type === type)
  )
}

function computeFilteredAlerts(visibleAlerts: Alert[], tab: '一级预警' | '二级预警'): Alert[] {
  return visibleAlerts.filter(a => a.type === tab)
}

const initialVisibleParks = computeVisibleParks(mockParks, defaultUser)
const initialVisibleAlerts = computeVisibleAlerts(mockAlerts, initialVisibleParks.map(p => p.id))

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: defaultUser,
  selectedProvince: null,
  selectedCity: null,
  selectedParkType: null,
  selectedParkId: null,
  alertTab: '一级预警',
  selectedReportId: null,
  parks: [...mockParks],
  alerts: [...mockAlerts],
  visibleParks: initialVisibleParks,
  filteredParks: computeFilteredParks(initialVisibleParks, null, null, null),
  visibleAlerts: initialVisibleAlerts,
  filteredAlerts: computeFilteredAlerts(initialVisibleAlerts, '一级预警'),
  visibleProvinces: computeVisibleProvinces(initialVisibleParks),
  visibleCities: computeVisibleCities(initialVisibleParks),

  setCurrentRole: (role, province, city) => {
    const { parks, alerts, selectedProvince, selectedCity, selectedParkType, alertTab } = get()
    const newUser: User = { role, province, city }
    const newVisibleParks = computeVisibleParks(parks, newUser)
    const newVisibleAlerts = computeVisibleAlerts(alerts, newVisibleParks.map(p => p.id))
    const newVisibleProvinces = computeVisibleProvinces(newVisibleParks)
    const newVisibleCities = computeVisibleCities(newVisibleParks)
    set({
      currentUser: newUser,
      visibleParks: newVisibleParks,
      visibleAlerts: newVisibleAlerts,
      visibleProvinces: newVisibleProvinces,
      visibleCities: newVisibleCities,
      filteredParks: computeFilteredParks(newVisibleParks, selectedProvince, selectedCity, selectedParkType),
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },

  setProvince: (province) => {
    const { visibleParks, selectedCity, selectedParkType } = get()
    set({
      selectedProvince: province,
      filteredParks: computeFilteredParks(visibleParks, province, selectedCity, selectedParkType),
    })
  },

  setCity: (city) => {
    const { visibleParks, selectedProvince, selectedParkType } = get()
    set({
      selectedCity: city,
      filteredParks: computeFilteredParks(visibleParks, selectedProvince, city, selectedParkType),
    })
  },

  setParkType: (type) => {
    const { visibleParks, selectedProvince, selectedCity } = get()
    set({
      selectedParkType: type,
      filteredParks: computeFilteredParks(visibleParks, selectedProvince, selectedCity, type),
    })
  },

  selectPark: (id) => set({ selectedParkId: id }),

  setAlertTab: (tab) => {
    const { visibleAlerts } = get()
    set({
      alertTab: tab,
      filteredAlerts: computeFilteredAlerts(visibleAlerts, tab),
    })
  },

  selectReport: (id) => set({ selectedReportId: id }),

  generateAutoAlerts: () => {
    const { visibleParks, alerts, alertTab } = get()
    const { soilMoistureThreshold, visitorDensityThreshold } = alertThresholds
    const newAlerts = [...alerts]
    const existingAlertKeys = new Set(
      alerts
        .filter(a => a.status !== '已解除')
        .map(a => `${a.parkId}-${a.type}-${a.reason}`)
    )

    visibleParks.forEach(park => {
      if (park.soilMoisture < soilMoistureThreshold) {
        const reason = `土壤含水量低于${soilMoistureThreshold}%，植被健康风险`
        const key = `${park.id}-一级预警-${reason}`
        if (!existingAlertKeys.has(key)) {
          const newAlert = generateAlertFromPark(park, reason, '一级预警')
          newAlerts.push(newAlert)
          existingAlertKeys.add(key)
        }
      }
      if (park.visitorDensity > visitorDensityThreshold) {
        const reason = `游客密度超过${visitorDensityThreshold}人/平方公里，承载压力过大`
        const key = `${park.id}-一级预警-${reason}`
        if (!existingAlertKeys.has(key)) {
          const newAlert = generateAlertFromPark(park, reason, '一级预警')
          newAlerts.push(newAlert)
          existingAlertKeys.add(key)
        }
      }
    })

    const { currentUser } = get()
    const newVisibleAlerts = computeVisibleAlerts(newAlerts, computeVisibleParks(get().parks, currentUser).map(p => p.id))
    set({
      alerts: newAlerts,
      visibleAlerts: newVisibleAlerts,
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },

  checkAndUpgradeAlerts: () => {
    const { alerts, alertTab, currentUser, parks } = get()
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const newAlerts = alerts.map(alert => {
      if (alert.type !== '一级预警') return alert
      if (alert.status === '已解除' || alert.status === '已批准') return alert
      const createdAt = new Date(alert.createdAt)
      if (createdAt < threeDaysAgo) {
        return {
          ...alert,
          type: '二级预警' as const,
          status: '审批中' as const,
          approvalChain: [
            { role: '养护组长' as const, status: '待审批' as const },
            { role: '区绿化办' as const, status: '待审批' as const },
            { role: '市园林局' as const, status: '待审批' as const },
          ],
        }
      }
      return alert
    })
    const newVisibleAlerts = computeVisibleAlerts(newAlerts, computeVisibleParks(parks, currentUser).map(p => p.id))
    set({
      alerts: newAlerts,
      visibleAlerts: newVisibleAlerts,
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },

  approveAlertStep: (alertId, stepIndex, remark) => {
    const { alerts, alertTab, currentUser, parks } = get()
    const newAlerts = alerts.map(alert => {
      if (alert.id !== alertId) return alert
      const newChain: ApprovalStep[] = alert.approvalChain.map((step, i) => {
        if (i !== stepIndex) return step
        return {
          ...step,
          status: '已通过' as const,
          operator: currentUser.role,
          timestamp: new Date().toISOString(),
          remark,
        }
      })
      const allApproved = newChain.every(s => s.status === '已通过')
      return {
        ...alert,
        approvalChain: newChain,
        status: allApproved ? '已批准' as const : alert.status,
      }
    })
    const newVisibleAlerts = computeVisibleAlerts(newAlerts, computeVisibleParks(parks, currentUser).map(p => p.id))
    set({
      alerts: newAlerts,
      visibleAlerts: newVisibleAlerts,
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },

  upgradeAlert: (alertId) => {
    const { alerts, alertTab, currentUser, parks } = get()
    const newAlerts = alerts.map(alert => {
      if (alert.id !== alertId) return alert
      return {
        ...alert,
        type: '二级预警' as const,
        status: '审批中' as const,
        approvalChain: [
          { role: '养护组长' as const, status: '待审批' as const },
          { role: '区绿化办' as const, status: '待审批' as const },
          { role: '市园林局' as const, status: '待审批' as const },
        ],
      }
    })
    const newVisibleAlerts = computeVisibleAlerts(newAlerts, computeVisibleParks(parks, currentUser).map(p => p.id))
    set({
      alerts: newAlerts,
      visibleAlerts: newVisibleAlerts,
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },

  pushAlert: (alertId) => {
    const { alerts, alertTab, currentUser, parks } = get()
    const newAlerts = alerts.map(alert => {
      if (alert.id !== alertId) return alert
      if (alert.status !== '待处理') return alert
      return {
        ...alert,
        status: '已推送' as const,
      }
    })
    const newVisibleAlerts = computeVisibleAlerts(newAlerts, computeVisibleParks(parks, currentUser).map(p => p.id))
    set({
      alerts: newAlerts,
      visibleAlerts: newVisibleAlerts,
      filteredAlerts: computeFilteredAlerts(newVisibleAlerts, alertTab),
    })
  },
}))
