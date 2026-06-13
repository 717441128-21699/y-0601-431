import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0A1A14]">
      <Sidebar />
      <Header />
      <main className="ml-[240px] pt-16 p-6 min-h-screen bg-[#0A1A14]">
        <Outlet />
      </main>
    </div>
  )
}
