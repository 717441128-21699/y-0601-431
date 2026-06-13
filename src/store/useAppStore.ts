import { create } from 'zustand'
import type { User, ParkData, Alert, ApprovalStep } from '@/types'
import { currentUser, parks as mockParks, alerts as mockAlerts } from '@/data/mockData'

interface AppState {
  currentUser: User
  selectedProvince: string | null
  selectedParkType: string | null
  selectedParkId: string | null
  alertTab: '一级预警' | '二级预警'
  selectedReportId: string | null
  parks: ParkData[]
  alerts: Alert[]
  filteredParks: ParkData[]
  filteredAlerts: Alert[]
  setProvince: (province: string | null) => void
  setParkType: (type: string | null) => void
  selectPark: (id: string | null) => void
  setAlertTab: (tab: '一级预警' | '二级预警') => void
  selectReport: (id: string | null) => void
  approveAlertStep: (alertId: string, stepIndex: number, remark: string) => void
  upgradeAlert: (alertId: string) => void
}

function computeFilteredParks(parks: ParkData[], province: string | null, type: string | null): ParkData[] {
  return parks.filter(p =>
    (province === null || p.province === province) &&
    (type === null || p.type === type)
  )
}

function computeFilteredAlerts(alerts: Alert[], tab: '一级预警' | '二级预警'): Alert[] {
  return alerts.filter(a => a.type === tab)
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser,
  selectedProvince: null,
  selectedParkType: null,
  selectedParkId: null,
  alertTab: '一级预警',
  selectedReportId: null,
  parks: [...mockParks],
  alerts: [...mockAlerts],
  filteredParks: computeFilteredParks(mockParks, null, null),
  filteredAlerts: computeFilteredAlerts(mockAlerts, '一级预警'),

  setProvince: (province) => {
    const { parks, selectedParkType } = get()
    set({
      selectedProvince: province,
      filteredParks: computeFilteredParks(parks, province, selectedParkType),
    })
  },

  setParkType: (type) => {
    const { parks, selectedProvince } = get()
    set({
      selectedParkType: type,
      filteredParks: computeFilteredParks(parks, selectedProvince, type),
    })
  },

  selectPark: (id) => set({ selectedParkId: id }),

  setAlertTab: (tab) => {
    const { alerts } = get()
    set({
      alertTab: tab,
      filteredAlerts: computeFilteredAlerts(alerts, tab),
    })
  },

  selectReport: (id) => set({ selectedReportId: id }),

  approveAlertStep: (alertId, stepIndex, remark) => {
    const { alerts, alertTab, currentUser } = get()
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
    set({
      alerts: newAlerts,
      filteredAlerts: computeFilteredAlerts(newAlerts, alertTab),
    })
  },

  upgradeAlert: (alertId) => {
    const { alerts, alertTab } = get()
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
    set({
      alerts: newAlerts,
      filteredAlerts: computeFilteredAlerts(newAlerts, alertTab),
    })
  },
}))
