import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { LoadingPage, Badge } from '../../components/ui'
import { FiShoppingBag, FiCalendar, FiHeart, FiPackage, FiBell, FiArrowRight } from 'react-icons/fi'
import { formatPrice } from '../../utils/currency'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [ordersRes, appRes, notifRes] = await Promise.all([
          api.get('/orders/myorders'),
          api.get('/appointments/my'),
          api.get('/notifications')
        ])
        setOrders(ordersRes.data.orders.slice(0, 3))
        setAppointments(appRes.data.appointments.slice(0, 3))
        setNotifications(notifRes.data.notifications.slice(0, 5))
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {user && (user.role === 'admin' || user.role === 'staff') && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛠️</span>
            <div>
              <p className="font-bold text-amber-900">Administrative Privileges</p>
              <p className="text-sm text-amber-700 font-medium">You are logged in as an <span className="capitalize font-semibold">{user.role}</span>. You can manage the entire application from the dashboard panel.</p>
            </div>
          </div>
          <Link 
            to={user.role === 'admin' ? '/admin' : '/staff'} 
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shrink-0"
          >
            Go to {user.role === 'admin' ? 'Admin' : 'Staff'} Panel &rarr;
          </Link>
        </div>
      )}

      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name}! 👋</h1>
        <p className="text-primary-200">Manage your pets, orders, and appointments from here.</p>
        <div className="flex gap-4 mt-6">
          <Link to="/pets" className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <FiPackage /> Browse Pets
          </Link>
          <Link to="/book-appointment" className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <FiCalendar /> Book Service
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          [FiShoppingBag, 'Total Orders', orders.length, '/orders', 'bg-blue-50 text-blue-600'],
          [FiCalendar, 'Appointments', appointments.length, '/my-appointments', 'bg-green-50 text-green-600'],
          [FiHeart, 'Wishlist', '-', '/wishlist', 'bg-red-50 text-red-600'],
          [FiBell, 'Notifications', notifications.length, '#', 'bg-yellow-50 text-yellow-600'],
        ].map(([Icon, label, count, to, cls]) => (
          <Link key={label} to={to} className="card p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cls}`}>
              <Icon />
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
            <Link to="/orders" className="text-primary-600 text-sm flex items-center gap-1">View all <FiArrowRight /></Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiShoppingBag className="text-4xl mx-auto mb-2" />
              <p className="text-sm">No orders yet</p>
              <Link to="/pets" className="text-primary-600 text-sm mt-1 block">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{formatPrice(order.totalPrice)}</span>
                    <Badge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Appointments</h2>
            <Link to="/my-appointments" className="text-primary-600 text-sm flex items-center gap-1">View all <FiArrowRight /></Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiCalendar className="text-4xl mx-auto mb-2" />
              <p className="text-sm">No appointments</p>
              <Link to="/book-appointment" className="text-primary-600 text-sm mt-1 block">Book a service</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map(apt => (
                <div key={apt._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{apt.service?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</p>
                    <p className="text-xs text-gray-400">Pet: {apt.petName}</p>
                  </div>
                  <Badge status={apt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No notifications</p>
          ) : (
            <div className="space-y-2">
              {notifications.map(n => (
                <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.isRead ? 'bg-primary-50' : 'bg-gray-50'}`}>
                  <FiBell className={`mt-0.5 shrink-0 ${!n.isRead ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
