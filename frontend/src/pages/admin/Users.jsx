import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, Pagination, EmptyState } from '../../components/ui'
import { FiSearch, FiEdit, FiTrash2, FiShield, FiAlertTriangle, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [adminPromptUser, setAdminPromptUser] = useState(null)
  const [showAdminPrompt, setShowAdminPrompt] = useState(false)
  const [adminConfirmEmail, setAdminConfirmEmail] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer', isActive: true })

  const openAdd = () => {
    setCreateForm({ name: '', email: '', password: '', phone: '', role: 'customer', isActive: true })
    setShowCreateModal(true)
  }

  const setCreateField = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setCreateForm(f => ({ ...f, [k]: val }))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      toast.error('Name, email, and password are required')
      return
    }
    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      await api.post('/users', createForm)
      toast.success('User created successfully')
      setShowCreateModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(search && { search }), ...(role && { role }) })
      const { data } = await api.get(`/users?${params}`)
      setUsers(data.users)
      setPages(data.pages)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page, search, role])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/users/${editUser._id}`, { role: editUser.role, isActive: editUser.isActive })
      toast.success('User updated')
      setShowModal(false)
      fetchUsers()
    } catch { toast.error('Update failed') }
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deactivated')
      fetchUsers()
    } catch { toast.error('Failed') }
  }

  const handleMakeAdmin = (user) => {
    setAdminPromptUser(user)
    setAdminConfirmEmail('')
    setShowAdminPrompt(true)
  }

  const handleConfirmAdmin = async () => {
    if (!adminPromptUser) return
    if (adminConfirmEmail !== adminPromptUser.email) {
      toast.error('Email confirmation does not match')
      return
    }
    try {
      await api.put(`/users/${adminPromptUser._id}`, { role: 'admin', isActive: true })
      toast.success(`${adminPromptUser.name} is now an Admin`)
      setShowAdminPrompt(false)
      setAdminPromptUser(null)
      setAdminConfirmEmail('')
      fetchUsers()
    } catch { toast.error('Failed to assign admin role') }
  }

  const handleRemoveAdmin = async (user) => {
    if (!window.confirm(`Remove admin privileges from ${user.name}? They will become a customer.`)) return
    try {
      await api.put(`/users/${user._id}`, { role: 'customer', isActive: true })
      toast.success('Admin privileges removed')
      fetchUsers()
    } catch { toast.error('Failed to remove admin role') }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
            <FiPlus /> Add User
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 text-sm" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="input w-36 text-sm" value={role} onChange={e => { setRole(e.target.value); setPage(1) }}>
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? <LoadingPage /> : users.length === 0 ? (
          <EmptyState icon="👥" title="No users found" />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                        <td className="px-4 py-3 text-gray-500">{user.phone || '—'}</td>
                        <td className="px-4 py-3"><Badge status={user.role} /></td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {user.role !== 'admin' && (
                              <button onClick={() => handleMakeAdmin(user)} title="Make Admin" className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                                <FiShield />
                              </button>
                            )}
                            {user.role === 'admin' && (
                              <button onClick={() => handleRemoveAdmin(user)} title="Remove Admin" className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg">
                                <FiShield />
                              </button>
                            )}
                            <button onClick={() => { setEditUser({ ...user }); setShowModal(true) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit /></button>
                            <button onClick={() => handleDeactivate(user._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit User">
        {editUser && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg">
                {editUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{editUser.name}</p>
                <p className="text-sm text-gray-500">{editUser.email}</p>
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={editUser.role} onChange={e => setEditUser(u => ({ ...u, role: e.target.value }))}>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={String(editUser.isActive)} onChange={e => setEditUser(u => ({ ...u, isActive: e.target.value === 'true' }))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save Changes</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={showAdminPrompt} onClose={() => { setShowAdminPrompt(false); setAdminConfirmEmail('') }} title="⚠️ Assign Admin Role">
        {adminPromptUser && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <FiAlertTriangle className="text-amber-600 text-xl shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">⚠️ Admin Permissions</p>
                <p>Admins can create, edit, and delete all resources, manage users, and control the entire website. Use with caution.</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Assigning admin to:</strong><br/>
                {adminPromptUser.name} ({adminPromptUser.email})
              </p>
            </div>

            <div>
              <label className="label">Confirm by typing their email</label>
              <input 
                type="email" 
                className="input" 
                placeholder={adminPromptUser.email}
                value={adminConfirmEmail} 
                onChange={e => setAdminConfirmEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Type the user's email address to confirm</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowAdminPrompt(false); setAdminConfirmEmail('') }} className="btn-outline flex-1">Cancel</button>
              <button type="button" onClick={handleConfirmAdmin} disabled={adminConfirmEmail !== adminPromptUser.email} className="btn-primary flex-1 disabled:opacity-50">
                Confirm Admin Role
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add User">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input 
              type="text" 
              className="input" 
              value={createForm.name} 
              onChange={setCreateField('name')} 
              required 
            />
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input 
              type="email" 
              className="input" 
              value={createForm.email} 
              onChange={setCreateField('email')} 
              required 
            />
          </div>
          <div>
            <label className="label">Password *</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Min. 6 characters"
              value={createForm.password} 
              onChange={setCreateField('password')} 
              required 
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input 
              type="tel" 
              className="input" 
              value={createForm.phone} 
              onChange={setCreateField('phone')} 
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select 
              className="input" 
              value={createForm.role} 
              onChange={setCreateField('role')}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select 
              className="input" 
              value={String(createForm.isActive)} 
              onChange={e => setCreateForm(u => ({ ...u, isActive: e.target.value === 'true' }))}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create User</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
