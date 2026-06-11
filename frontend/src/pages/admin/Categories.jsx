import { useState, useEffect } from 'react'
import api from '../../utils/api'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LoadingPage, Badge, Modal, EmptyState } from '../../components/ui'
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', image: '', isActive: true }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      // Fetch all categories (active and inactive) for admin management
      const { data } = await api.get('/categories?all=true')
      setCategories(data.categories || [])
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true
    })
    setEditId(cat._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form)
        toast.success('Category updated successfully')
      } else {
        await api.post('/categories', form)
        toast.success('Category added successfully')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Category deactivated successfully')
      fetchCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
            <FiPlus /> Add Category
          </button>
        </div>

        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="input pl-9 text-sm" 
            placeholder="Search categories..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        {loading ? (
          <LoadingPage />
        ) : filtered.length === 0 ? (
          <EmptyState 
            icon="📁" 
            title="No categories found" 
            action={<button onClick={openAdd} className="btn-primary">Add Category</button>} 
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Category', 'Description', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(cat => (
                    <tr key={cat._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={cat.image || 'https://via.placeholder.com/40'} 
                            alt={cat.name} 
                            className="w-10 h-10 object-cover rounded-lg" 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                          />
                          <span className="font-medium text-gray-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(cat)} 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          {cat.isActive && (
                            <button 
                              onClick={() => handleDelete(cat._id)} 
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Deactivate"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input 
              className="input" 
              value={form.name} 
              onChange={set('name')} 
              required 
              placeholder="e.g. Birds, Reptiles"
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea 
              className="input" 
              rows={2} 
              value={form.description} 
              onChange={set('description')} 
              placeholder="Provide a brief description of this category"
            />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input 
              className="input" 
              value={form.image} 
              onChange={set('image')} 
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer pt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={form.isActive} 
              onChange={set('isActive')} 
              className="w-4 h-4" 
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible in selection forms)</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
            >
              {editId ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
