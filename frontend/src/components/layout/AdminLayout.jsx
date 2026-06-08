import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <Link to="/admin" className="text-xl font-bold text-primary-700 inline-block mb-6">Admin Panel</Link>
          <nav className="space-y-2 text-sm">
            <Link to="/admin" className="block py-2 px-3 rounded hover:bg-primary-50">Dashboard</Link>
            <Link to="/admin/users" className="block py-2 px-3 rounded hover:bg-primary-50">Users</Link>
            <Link to="/admin/pets" className="block py-2 px-3 rounded hover:bg-primary-50">Pets</Link>
            <Link to="/admin/products" className="block py-2 px-3 rounded hover:bg-primary-50">Products</Link>
            <Link to="/admin/orders" className="block py-2 px-3 rounded hover:bg-primary-50">Orders</Link>
            <Link to="/admin/services" className="block py-2 px-3 rounded hover:bg-primary-50">Services</Link>
            <Link to="/admin/appointments" className="block py-2 px-3 rounded hover:bg-primary-50">Appointments</Link>
            <Link to="/admin/reviews" className="block py-2 px-3 rounded hover:bg-primary-50">Reviews</Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
