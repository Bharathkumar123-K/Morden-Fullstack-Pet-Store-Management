import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'
import api from '../../utils/api'

export default function AuthPage({ mode = 'login' }) {
  const [tab, setTab] = useState(mode)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'admin') navigate('/')
      else if (user.role === 'staff') navigate('/staff')
      else navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: form.email })
      toast.success('Reset email sent! Check your inbox.')
      setForgotMode(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-2xl mb-2">
            <MdPets className="text-3xl" /> PetStore
          </Link>
          <p className="text-gray-500">Your trusted pet companion</p>
        </div>

        <div className="card p-8">
          {forgotMode ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your email to receive a reset link.</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Sending...' : 'Send Reset Link'}</button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-sm text-gray-500 hover:text-primary-600">← Back to Login</button>
              </form>
            </>
          ) : (
            <>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                {['login', 'register'].map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}>
                    {t === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" value={form.password} onChange={set('password')} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</button>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base">{loading ? 'Logging in...' : 'Login'}</button>
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                    <p><strong>Demo:</strong> admin@petstore.com / admin123</p>
                    <p>staff@petstore.com / staff123</p>
                    <p>customer@petstore.com / customer123</p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" className="input pl-10" placeholder="John Doe" value={form.name} onChange={set('name')} required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" className="input pl-10" placeholder="+1 555-0000" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base">{loading ? 'Creating Account...' : 'Create Account'}</button>
                  <p className="text-xs text-center text-gray-400">By registering, you agree to our <Link to="/terms" className="text-primary-600">Terms</Link> and <Link to="/privacy" className="text-primary-600">Privacy Policy</Link></p>
                </form>
              )}
            </>
          )}
        </div>
        <p className="text-center mt-4 text-sm text-gray-500">
          <Link to="/" className="text-primary-600 hover:text-primary-700">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
