import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import ParkDetail from '@/pages/ParkDetail'
import Alerts from '@/pages/Alerts'
import MaintenancePlan from '@/pages/MaintenancePlan'
import Reports from '@/pages/Reports'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/park/:id" element={<ParkDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/plan" element={<MaintenancePlan />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}
