import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MdPets } from 'react-icons/md'
import { FiHome, FiPackage, FiShoppingBag, FiCalendar, FiUsers, FiStar, FiLogOut, FiMenu, FiX, FiTag, FiGrid } from 'react-icons/fi'

export default function DashboardLayout({ children, role = 'admin' }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Menu Bar */}
      <header className="bg-gray-900 text-white shadow-md border-b border-gray-800 shrink-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg hover:scale-[1.01] transition-transform">
                <MdPets className="text-primary-400 text-xl" />
                <span className="capitalize">{role} Panel</span>
              </Link>
              
              {/* Horizontal Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {links.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${location.pathname === to ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <Icon className="text-sm shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Profile Actions */}
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xs font-semibold text-gray-300 hover:text-white transition-colors bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                &larr; Back to Site
              </Link>
              
              <div className="flex items-center gap-2.5 border-l border-gray-800 pl-4">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                </div>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors ml-1" title="Logout">
                  <FiLogOut className="text-base" />
                </button>
              </div>

              {/* Mobile menu toggle for smaller screens */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="lg:hidden p-2 text-gray-300 hover:bg-gray-800 rounded-lg"
              >
                {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-gray-900 py-3 px-4 space-y-1 animate-fade-in">
            {links.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
