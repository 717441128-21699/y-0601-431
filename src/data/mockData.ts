import type {
  ParkData,
  Alert,
  MaintenancePlan,
  WeeklyReport,
  User,
} from '@/types'

export const provinces = [
  { name: '北京', avgHealthIndex: 82.3 },
  { name: '上海', avgHealthIndex: 85.1 },
  { name: '广东', avgHealthIndex: 78.6 },
  { name: '浙江', avgHealthIndex: 83.9 },
  { name: '四川', avgHealthIndex: 76.4 },
  { name: '湖北', avgHealthIndex: 79.2 },
  { name: '江苏', avgHealthIndex: 84.5 },
  { name: '陕西', avgHealthIndex: 72.8 },
  { name: '重庆', avgHealthIndex: 77.3 },
  { name: '山东', avgHealthIndex: 80.1 },
  { name: '福建', avgHealthIndex: 81.7 },
]

export const cities = [
  { name: '北京', province: '北京', avgHealthIndex: 82.3, maintenanceEfficiency: 88.5 },
  { name: '上海', province: '上海', avgHealthIndex: 85.1, maintenanceEfficiency: 91.2 },
  { name: '广州', province: '广东', avgHealthIndex: 80.4, maintenanceEfficiency: 85.3 },
  { name: '深圳', province: '广东', avgHealthIndex: 77.2, maintenanceEfficiency: 83.7 },
  { name: '杭州', province: '浙江', avgHealthIndex: 83.9, maintenanceEfficiency: 89.6 },
  { name: '成都', province: '四川', avgHealthIndex: 76.4, maintenanceEfficiency: 79.8 },
  { name: '武汉', province: '湖北', avgHealthIndex: 79.2, maintenanceEfficiency: 82.1 },
  { name: '南京', province: '江苏', avgHealthIndex: 84.5, maintenanceEfficiency: 90.4 },
  { name: '西安', province: '陕西', avgHealthIndex: 72.8, maintenanceEfficiency: 76.3 },
  { name: '重庆', province: '重庆', avgHealthIndex: 77.3, maintenanceEfficiency: 80.5 },
  { name: '济南', province: '山东', avgHealthIndex: 80.1, maintenanceEfficiency: 84.9 },
  { name: '福州', province: '福建', avgHealthIndex: 81.7, maintenanceEfficiency: 86.2 },
  { name: '苏州', province: '江苏', avgHealthIndex: 86.2, maintenanceEfficiency: 92.1 },
  { name: '厦门', province: '福建', avgHealthIndex: 82.5, maintenanceEfficiency: 87.8 },
  { name: '青岛', province: '山东', avgHealthIndex: 79.8, maintenanceEfficiency: 83.4 },
]

function generateNdviTrend(): { date: string; value: number }[] {
  const base = 0.4 + Math.random() * 0.25
  return [
    { date: '2026-06-08', value: +(base - 0.02 + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-09', value: +(base - 0.01 + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-10', value: +(base + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-11', value: +(base + 0.01 + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-12', value: +(base + 0.02 + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-13', value: +(base + 0.015 + Math.random() * 0.04).toFixed(3) },
    { date: '2026-06-14', value: +(base + 0.025 + Math.random() * 0.04).toFixed(3) },
  ]
}

function generateCost(): { category: string; amount: number }[] {
  const base = 5000 + Math.random() * 15000
  return [
    { category: '人工费', amount: +((base * 0.4 + Math.random() * 2000)).toFixed(0) },
    { category: '水费', amount: +((base * 0.2 + Math.random() * 1000)).toFixed(0) },
    { category: '肥料费', amount: +((base * 0.15 + Math.random() * 800)).toFixed(0) },
    { category: '设备维护费', amount: +((base * 0.15 + Math.random() * 800)).toFixed(0) },
    { category: '其他', amount: +((base * 0.1 + Math.random() * 500)).toFixed(0) },
  ]
}

function generateSoilData(): { timestamp: string; moisture: number; temperature: number }[] {
  const baseMoisture = 30 + Math.random() * 20
  const baseTemp = 22 + Math.random() * 6
  const result: { timestamp: string; moisture: number; temperature: number }[] = []
  for (let i = 8; i <= 14; i++) {
    result.push({
      timestamp: `2026-06-${String(i).padStart(2, '0')}T08:00:00`,
      moisture: +(baseMoisture + (Math.random() - 0.5) * 8).toFixed(1),
      temperature: +(baseTemp + (Math.random() - 0.5) * 4).toFixed(1),
    })
  }
  return result
}

export const parks: ParkData[] = [
  {
    id: 'park-001',
    name: '翠湖公园',
    city: '北京',
    province: '北京',
    type: '综合公园',
    metrics: { healthIndex: 85.2, irrigationEfficiency: 89.3, visitorCarryRate: 72.1, maintenanceResponseRate: 94.5 },
    soilMoisture: 42.3,
    visitorDensity: 156,
    areas: [
      { id: 'area-001-1', name: '湖区绿地', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-001-2', name: '樱花大道', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-001-3', name: '儿童游乐区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-002',
    name: '人民公园',
    city: '上海',
    province: '上海',
    type: '综合公园',
    metrics: { healthIndex: 88.7, irrigationEfficiency: 92.1, visitorCarryRate: 81.3, maintenanceResponseRate: 96.2 },
    soilMoisture: 45.6,
    visitorDensity: 203,
    areas: [
      { id: 'area-002-1', name: '中心草坪', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-002-2', name: '荷花池区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-003',
    name: '紫金山公园',
    city: '南京',
    province: '江苏',
    type: '专类公园',
    metrics: { healthIndex: 82.4, irrigationEfficiency: 86.5, visitorCarryRate: 65.8, maintenanceResponseRate: 91.3 },
    soilMoisture: 38.7,
    visitorDensity: 98,
    areas: [
      { id: 'area-003-1', name: '山脊步道区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-003-2', name: '植物园片区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-003-3', name: '明孝陵景区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-004',
    name: '白云山公园',
    city: '广州',
    province: '广东',
    type: '综合公园',
    metrics: { healthIndex: 79.6, irrigationEfficiency: 83.2, visitorCarryRate: 78.4, maintenanceResponseRate: 88.7 },
    soilMoisture: 51.2,
    visitorDensity: 187,
    areas: [
      { id: 'area-004-1', name: '山顶广场', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-004-2', name: '摩星岭绿地', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-005',
    name: '西湖风景区',
    city: '杭州',
    province: '浙江',
    type: '专类公园',
    metrics: { healthIndex: 90.1, irrigationEfficiency: 93.8, visitorCarryRate: 86.5, maintenanceResponseRate: 97.1 },
    soilMoisture: 48.9,
    visitorDensity: 312,
    areas: [
      { id: 'area-005-1', name: '苏堤春晓', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-005-2', name: '曲院风荷', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-005-3', name: '花港观鱼', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-006',
    name: '锦城公园',
    city: '成都',
    province: '四川',
    type: '带状公园',
    metrics: { healthIndex: 74.3, irrigationEfficiency: 78.6, visitorCarryRate: 58.2, maintenanceResponseRate: 82.4 },
    soilMoisture: 44.1,
    visitorDensity: 87,
    areas: [
      { id: 'area-006-1', name: '环城绿道', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-006-2', name: '湿地公园', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-007',
    name: '东湖绿道公园',
    city: '武汉',
    province: '湖北',
    type: '带状公园',
    metrics: { healthIndex: 80.5, irrigationEfficiency: 85.1, visitorCarryRate: 71.3, maintenanceResponseRate: 89.6 },
    soilMoisture: 46.8,
    visitorDensity: 142,
    areas: [
      { id: 'area-007-1', name: '听涛景区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-007-2', name: '磨山景区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-007-3', name: '落雁景区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-008',
    name: '大雁塔景区公园',
    city: '西安',
    province: '陕西',
    type: '专类公园',
    metrics: { healthIndex: 71.8, irrigationEfficiency: 75.4, visitorCarryRate: 62.7, maintenanceResponseRate: 78.3 },
    soilMoisture: 32.5,
    visitorDensity: 195,
    areas: [
      { id: 'area-008-1', name: '塔前广场', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-008-2', name: '大唐芙蓉园', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-009',
    name: '洪崖洞社区公园',
    city: '重庆',
    province: '重庆',
    type: '社区公园',
    metrics: { healthIndex: 76.9, irrigationEfficiency: 80.3, visitorCarryRate: 84.6, maintenanceResponseRate: 85.1 },
    soilMoisture: 43.7,
    visitorDensity: 268,
    areas: [
      { id: 'area-009-1', name: '滨江步道', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-009-2', name: '崖壁绿化区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-010',
    name: '莲花山公园',
    city: '深圳',
    province: '广东',
    type: '综合公园',
    metrics: { healthIndex: 83.4, irrigationEfficiency: 87.9, visitorCarryRate: 75.2, maintenanceResponseRate: 92.8 },
    soilMoisture: 50.3,
    visitorDensity: 178,
    areas: [
      { id: 'area-010-1', name: '山顶广场', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-010-2', name: '风筝广场', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-010-3', name: '桃花林', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-011',
    name: '趵突泉公园',
    city: '济南',
    province: '山东',
    type: '专类公园',
    metrics: { healthIndex: 81.2, irrigationEfficiency: 84.7, visitorCarryRate: 69.8, maintenanceResponseRate: 90.1 },
    soilMoisture: 52.1,
    visitorDensity: 163,
    areas: [
      { id: 'area-011-1', name: '泉池周边', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-011-2', name: '万竹园', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
  {
    id: 'park-012',
    name: '鼓山社区公园',
    city: '福州',
    province: '福建',
    type: '社区公园',
    metrics: { healthIndex: 78.5, irrigationEfficiency: 82.1, visitorCarryRate: 54.3, maintenanceResponseRate: 86.7 },
    soilMoisture: 47.6,
    visitorDensity: 72,
    areas: [
      { id: 'area-012-1', name: '登山步道', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-012-2', name: '休闲广场', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
      { id: 'area-012-3', name: '梅里景区', ndviTrend: generateNdviTrend(), cost: generateCost(), soilData: generateSoilData() },
    ],
  },
]

export const alerts: Alert[] = [
  {
    id: 'alert-001',
    parkId: 'park-008',
    parkName: '大雁塔景区公园',
    type: '一级预警',
    reason: '土壤含水量连续3天低于20%，植被枯黄风险极高',
    createdAt: '2026-06-12T09:30:00',
    status: '审批中',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '王建国', timestamp: '2026-06-12T10:15:00', remark: '情况属实，需紧急处理' },
      { role: '区绿化办', status: '已通过', operator: '李明辉', timestamp: '2026-06-12T11:30:00', remark: '同意启动应急浇灌' },
      { role: '市园林局', status: '待审批' },
    ],
  },
  {
    id: 'alert-002',
    parkId: 'park-006',
    parkName: '锦城公园',
    type: '二级预警',
    reason: 'NDVI指数持续下降，部分区域植被健康状况恶化',
    createdAt: '2026-06-11T14:20:00',
    status: '已批准',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '张伟', timestamp: '2026-06-11T15:00:00', remark: '已现场确认' },
      { role: '区绿化办', status: '已通过', operator: '陈芳', timestamp: '2026-06-11T16:45:00', remark: '批准实施养护方案' },
      { role: '市园林局', status: '已通过', operator: '刘洋', timestamp: '2026-06-12T09:00:00', remark: '同意，请尽快执行' },
    ],
  },
  {
    id: 'alert-003',
    parkId: 'park-004',
    parkName: '白云山公园',
    type: '二级预警',
    reason: '游客承载率超过85%，草坪踩踏严重需限制人流',
    createdAt: '2026-06-13T08:00:00',
    status: '已推送',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '赵磊', timestamp: '2026-06-13T08:45:00', remark: '建议临时限流' },
      { role: '区绿化办', status: '待审批' },
    ],
  },
  {
    id: 'alert-004',
    parkId: 'park-001',
    parkName: '翠湖公园',
    type: '一级预警',
    reason: '湖区绿地土壤温度异常升高至35°C，植被灼伤风险',
    createdAt: '2026-06-14T07:15:00',
    status: '待处理',
    approvalChain: [],
  },
  {
    id: 'alert-005',
    parkId: 'park-009',
    parkName: '洪崖洞社区公园',
    type: '二级预警',
    reason: '崖壁绿化区土壤含水量偏低，存在滑坡风险',
    createdAt: '2026-06-10T16:30:00',
    status: '已解除',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '周强', timestamp: '2026-06-10T17:00:00', remark: '已排查，需加固' },
      { role: '区绿化办', status: '已通过', operator: '吴秀英', timestamp: '2026-06-11T09:30:00', remark: '批准加固方案' },
      { role: '市园林局', status: '已通过', operator: '郑涛', timestamp: '2026-06-11T14:00:00', remark: '施工完成，预警解除' },
    ],
  },
  {
    id: 'alert-006',
    parkId: 'park-003',
    parkName: '紫金山公园',
    type: '二级预警',
    reason: '植物园片区灌溉系统故障，灌溉效率降至60%',
    createdAt: '2026-06-13T11:00:00',
    status: '审批中',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '孙志远', timestamp: '2026-06-13T11:30:00', remark: '设备已报修，需人工补浇' },
      { role: '区绿化办', status: '待审批' },
    ],
  },
  {
    id: 'alert-007',
    parkId: 'park-005',
    parkName: '西湖风景区',
    type: '一级预警',
    reason: '曲院风荷区域荷花病虫害扩散，需紧急防治',
    createdAt: '2026-06-14T06:45:00',
    status: '已推送',
    approvalChain: [
      { role: '养护组长', status: '已通过', operator: '钱浩', timestamp: '2026-06-14T07:20:00', remark: '已确认病虫害类型，建议农药防治' },
      { role: '区绿化办', status: '待审批' },
    ],
  },
]

function generateRiskPrediction(): { date: string; riskLevel: number }[] {
  const result: { date: string; riskLevel: number }[] = []
  for (let i = 0; i < 90; i++) {
    const d = new Date(2026, 5, 15)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    let risk: number
    if (i < 10) {
      risk = Math.random() < 0.3 ? 3 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)
    } else if (i < 40) {
      risk = Math.random() < 0.5 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)
    } else if (i < 70) {
      risk = Math.random() < 0.2 ? 4 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2)
    } else {
      risk = Math.random() < 0.4 ? 3 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)
    }
    risk = Math.min(5, Math.max(1, risk))
    result.push({ date: dateStr, riskLevel: risk })
  }
  return result
}

export const maintenancePlans: MaintenancePlan[] = [
  {
    id: 'plan-001',
    fileName: '翠湖公园2026年夏季养护方案.xlsx',
    uploadDate: '2026-06-10',
    nodes: [
      { area: '湖区绿地', task: '草坪修剪及补种', plannedDate: '2026-06-18', status: '待执行' },
      { area: '樱花大道', task: '病虫害防治喷药', plannedDate: '2026-06-16', status: '进行中' },
      { area: '儿童游乐区', task: '灌木整形修剪', plannedDate: '2026-06-20', status: '待执行' },
      { area: '湖区绿地', task: '灌溉系统检修', plannedDate: '2026-06-15', status: '已完成' },
      { area: '樱花大道', task: '施肥及土壤改良', plannedDate: '2026-06-22', status: '待执行' },
      { area: '儿童游乐区', task: '排水沟清理', plannedDate: '2026-06-25', status: '待执行' },
    ],
    riskPrediction: generateRiskPrediction(),
    recommendations: [
      { type: '浇灌频次', description: '建议每日浇水2次，每次30分钟，集中在清晨6:00-7:00和傍晚18:00-19:00', applicableArea: '湖区绿地', confidence: 0.92 },
      { type: '修剪方案', description: '建议对樱花大道两侧灌木进行轻度修剪，保留冠幅60%以上，避免夏季高温期重剪', applicableArea: '樱花大道', confidence: 0.87 },
      { type: '浇灌频次', description: '儿童游乐区草坪建议每日浇水1次，每次20分钟，注意避开游客高峰时段', applicableArea: '儿童游乐区', confidence: 0.85 },
      { type: '修剪方案', description: '湖区绿地芦苇建议在7月中旬前完成修剪，控制高度在1.2米以内', applicableArea: '湖区绿地', confidence: 0.78 },
    ],
  },
  {
    id: 'plan-002',
    fileName: '锦城公园2026年汛期养护方案.xlsx',
    uploadDate: '2026-06-12',
    nodes: [
      { area: '环城绿道', task: '排水设施全面检查', plannedDate: '2026-06-17', status: '进行中' },
      { area: '湿地公园', task: '水生植物补植', plannedDate: '2026-06-19', status: '待执行' },
      { area: '环城绿道', task: '边坡绿化加固', plannedDate: '2026-06-23', status: '待执行' },
      { area: '湿地公园', task: '水质监测及治理', plannedDate: '2026-06-21', status: '待执行' },
      { area: '环城绿道', task: '乔木支撑加固', plannedDate: '2026-06-18', status: '已完成' },
    ],
    riskPrediction: generateRiskPrediction(),
    recommendations: [
      { type: '浇灌频次', description: '汛期适当减少人工浇灌，根据降雨情况动态调整，建议每周浇水不超过3次', applicableArea: '环城绿道', confidence: 0.91 },
      { type: '修剪方案', description: '湿地公园水生植物建议在水位下降后进行修剪，避免汛期操作造成植物损伤', applicableArea: '湿地公园', confidence: 0.83 },
      { type: '浇灌频次', description: '湿地公园新补植水生植物需保持水位稳定，建议每日检查水位并适时补水', applicableArea: '湿地公园', confidence: 0.88 },
    ],
  },
]

export const weeklyReports: WeeklyReport[] = [
  {
    id: 'report-001',
    week: '2026年第23周',
    healthIndexYoY: 3.2,
    healthIndexMoM: 0.8,
    costTrend: [
      { week: '2026年第19周', amount: 285600 },
      { week: '2026年第20周', amount: 293400 },
      { week: '2026年第21周', amount: 278900 },
      { week: '2026年第22周', amount: 312500 },
      { week: '2026年第23周', amount: 298700 },
    ],
    visitorSatisfaction: 87.3,
    suggestions: [
      '加强高温时段的灌溉频次，建议在气温超过35°C时启动应急浇灌机制',
      '部分公园NDVI指数下降明显，建议增加植被健康巡查频率至每日一次',
      '建议对承载率超80%的公园实行分时段限流措施',
    ],
  },
  {
    id: 'report-002',
    week: '2026年第22周',
    healthIndexYoY: 2.5,
    healthIndexMoM: -0.3,
    costTrend: [
      { week: '2026年第18周', amount: 271200 },
      { week: '2026年第19周', amount: 285600 },
      { week: '2026年第20周', amount: 293400 },
      { week: '2026年第21周', amount: 278900 },
      { week: '2026年第22周', amount: 312500 },
    ],
    visitorSatisfaction: 85.6,
    suggestions: [
      '上周养护成本上升12%，主要因设备维护费增加，建议优化设备巡检周期',
      '西北地区公园土壤含水量普遍偏低，建议调配移动灌溉设备支援',
      '游客满意度环比下降1.7%，需关注游乐设施安全及环境卫生',
    ],
  },
  {
    id: 'report-003',
    week: '2026年第21周',
    healthIndexYoY: 1.8,
    healthIndexMoM: 0.5,
    costTrend: [
      { week: '2026年第17周', amount: 268300 },
      { week: '2026年第18周', amount: 271200 },
      { week: '2026年第19周', amount: 285600 },
      { week: '2026年第20周', amount: 293400 },
      { week: '2026年第21周', amount: 278900 },
    ],
    visitorSatisfaction: 88.1,
    suggestions: [
      '整体健康指数稳定上升，各公园养护方案执行情况良好',
      '建议在社区公园推广智能灌溉系统，预计可提升灌溉效率15%',
      '部分专类公园游客满意度偏低，建议增加互动体验设施',
    ],
  },
  {
    id: 'report-004',
    week: '2026年第20周',
    healthIndexYoY: 4.1,
    healthIndexMoM: 1.2,
    costTrend: [
      { week: '2026年第16周', amount: 256800 },
      { week: '2026年第17周', amount: 268300 },
      { week: '2026年第18周', amount: 271200 },
      { week: '2026年第19周', amount: 285600 },
      { week: '2026年第20周', amount: 293400 },
    ],
    visitorSatisfaction: 89.5,
    suggestions: [
      '春季养护效果显著，健康指数同比提升4.1%，建议总结优秀经验推广',
      '成本呈持续上升趋势，建议引入精细化预算管理，控制人工费增幅',
      '游客满意度达年内最高，建议持续优化服务品质并关注暑期客流管理',
    ],
  },
]

export const currentUser: User = {
  role: '国家级',
}
