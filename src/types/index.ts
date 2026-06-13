export interface GreenSpaceMetrics {
  healthIndex: number
  irrigationEfficiency: number
  visitorCarryRate: number
  maintenanceResponseRate: number
}

export type ParkType = '综合公园' | '社区公园' | '专类公园' | '带状公园'

export interface ParkArea {
  id: string
  name: string
  ndviTrend: { date: string; value: number }[]
  cost: { category: string; amount: number }[]
  soilData: { timestamp: string; moisture: number; temperature: number }[]
}

export interface ParkData {
  id: string
  name: string
  city: string
  province: string
  type: ParkType
  metrics: GreenSpaceMetrics
  soilMoisture: number
  visitorDensity: number
  areas: ParkArea[]
}

export type AlertType = '一级预警' | '二级预警'
export type AlertStatus = '待处理' | '已推送' | '审批中' | '已批准' | '已解除'

export interface ApprovalStep {
  role: '养护组长' | '区绿化办' | '市园林局'
  status: '待审批' | '已通过' | '已驳回'
  operator?: string
  timestamp?: string
  remark?: string
}

export interface Alert {
  id: string
  parkId: string
  parkName: string
  type: AlertType
  reason: string
  createdAt: string
  status: AlertStatus
  approvalChain: ApprovalStep[]
}

export type MaintenanceNodeStatus = '待执行' | '进行中' | '已完成'

export interface MaintenanceNode {
  area: string
  task: string
  plannedDate: string
  status: MaintenanceNodeStatus
}

export type RecommendationType = '浇灌频次' | '修剪方案'

export interface Recommendation {
  type: RecommendationType
  description: string
  applicableArea: string
  confidence: number
}

export interface MaintenancePlan {
  id: string
  fileName: string
  uploadDate: string
  nodes: MaintenanceNode[]
  riskPrediction: { date: string; riskLevel: number }[]
  recommendations: Recommendation[]
}

export interface WeeklyReport {
  id: string
  week: string
  healthIndexYoY: number
  healthIndexMoM: number
  costTrend: { week: string; amount: number }[]
  visitorSatisfaction: number
  suggestions: string[]
}

export type UserRole = '国家级' | '省级' | '市级' | '区绿化办' | '养护组长' | '养护队长'

export interface User {
  role: UserRole
  province?: string
  city?: string
  district?: string
}
