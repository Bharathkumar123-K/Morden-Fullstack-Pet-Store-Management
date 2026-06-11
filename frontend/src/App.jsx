import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import ScrollToTop from './components/layout/ScrollToTop'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import PetCatalog from './pages/public/PetCatalog'
import PetDetail from './pages/public/PetDetail'
import Services from './pages/public/Services'
import FAQ from './pages/public/FAQ'
import Contact from './pages/public/Contact'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import Terms from './pages/public/Terms'
import AuthPage from './pages/public/AuthPage'

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderHistory from './pages/customer/OrderHistory'
import OrderDetail from './pages/customer/OrderDetail'
import AppointmentBooking from './pages/customer/AppointmentBooking'
import MyAppointments from './pages/customer/MyAppointments'
import Profile from './pages/customer/Profile'
import Wishlist from './pages/customer/Wishlist'
import Products from './pages/public/Products'

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard'
import ManagePets from './pages/staff/ManagePets'
import ManageProducts from './pages/staff/ManageProducts'
import ManageOrders from './pages/staff/ManageOrders'
import ManageAppointments from './pages/staff/ManageAppointments'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminPets from './pages/admin/Pets'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminServices from './pages/admin/AdminServices'
import AdminAppointments from './pages/admin/Appointments'
import AdminReviews from './pages/admin/Reviews'
import AdminCategories from './pages/admin/Categories'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/pets" element={<PublicLayout><PetCatalog /></PublicLayout>} />
            <Route path="/pets/:id" element={<PublicLayout><PetDetail /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage mode="register" />} />

            {/* Customer */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['customer', 'admin', 'staff']}><PublicLayout><CustomerDashboard /></PublicLayout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute roles={['customer']}><PublicLayout><Cart /></PublicLayout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute roles={['customer']}><PublicLayout><Checkout /></PublicLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={['customer']}><PublicLayout><OrderHistory /></PublicLayout></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute roles={['customer']}><PublicLayout><OrderDetail /></PublicLayout></ProtectedRoute>} />
            <Route path="/book-appointment" element={<ProtectedRoute roles={['customer']}><PublicLayout><AppointmentBooking /></PublicLayout></ProtectedRoute>} />
            <Route path="/my-appointments" element={<ProtectedRoute roles={['customer']}><PublicLayout><MyAppointments /></PublicLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute roles={['customer', 'staff', 'admin']}><PublicLayout><Profile /></PublicLayout></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute roles={['customer']}><PublicLayout><Wishlist /></PublicLayout></ProtectedRoute>} />

            {/* Staff */}
            <Route path="/staff" element={<ProtectedRoute roles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/pets" element={<ProtectedRoute roles={['staff', 'admin']}><ManagePets /></ProtectedRoute>} />
            <Route path="/staff/products" element={<ProtectedRoute roles={['staff', 'admin']}><ManageProducts /></ProtectedRoute>} />
            <Route path="/staff/orders" element={<ProtectedRoute roles={['staff', 'admin']}><ManageOrders /></ProtectedRoute>} />
            <Route path="/staff/appointments" element={<ProtectedRoute roles={['staff', 'admin']}><ManageAppointments /></ProtectedRoute>} />

            {/* Admin - isolated admin panel routes using AdminLayout */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="pets" element={<AdminPets />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
