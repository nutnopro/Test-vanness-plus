import { useState } from 'react'
import Modal from '../ui/Modal'

export default function CategoryModal({ isOpen, onClose, onCreate, onDelete, categories }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Category name is required')
    setLoading(true)
    setError('')
    try {
      await onCreate(name.trim())
      setName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New category name..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Add'}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No categories yet</p>
        )}
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span className="text-sm text-gray-700">📁 {cat.name}</span>
            <button
              onClick={() => onDelete(cat.id)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}