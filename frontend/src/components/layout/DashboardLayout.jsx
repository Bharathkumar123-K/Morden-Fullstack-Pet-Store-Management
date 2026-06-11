import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MdPets } from 'react-icons/md'
import { FiHome, FiPackage, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2, FiStar, FiSettings, FiLogOut, FiMenu, FiX, FiTag, FiGrid } from 'react-icons/fi'

export default function DashboardLayout({ children, role = 'admin' }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const adminLinks = [
    { label: 'Dashboard', to: '/admin', icon: FiHome },
    { label: 'Users', to: '/admin/users', icon: FiUsers },
    { label: 'Pets', to: '/admin/pets', icon: MdPets },
    { label: 'Categories', to: '/admin/categories', icon: FiGrid },
    { label: 'Products', to: '/admin/products', icon: FiPackage },
    { label: 'Orders', to: '/admin/orders', icon: FiShoppingBag },
    { label: 'Services', to: '/admin/services', icon: FiTag },
    { label: 'Appointments', to: '/admin/appointments', icon: FiCalendar },
    { label: 'Reviews', to: '/admin/reviews', icon: FiStar },
  ]

  const staffLinks = [
    { label: 'Dashboard', to: '/staff', icon: FiHome },
    { label: 'Pets', to: '/staff/pets', icon: MdPets },
    { label: 'Products', to: '/staff/products', icon: FiPackage },
    { label: 'Orders', to: '/staff/orders', icon: FiShoppingBag },
    { label: 'Appointments', to: '/staff/appointments', icon: FiCalendar },
  ]

  const links = role === 'admin' ? adminLinks : staffLinks

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {sidebarOpen && (
            <Link to="/" className="flex items-center gap-2 text-white font-bold">
              <MdPets className="text-primary-400 text-xl" /> PetStore
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-800 ml-auto">
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${location.pathname === to ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon className="text-lg shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className={`flex items-center gap-3 mb-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={logout} className={`flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors ${!sidebarOpen && 'justify-center w-full'}`}>
            <FiLogOut /> {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800 capitalize">{role} Panel</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-primary-600 hover:text-primary-700">← Back to Site</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
