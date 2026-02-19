import Modal from '../ui/Modal'
import TaskForm from './TaskForm'
import { useState } from 'react'

export default function TaskModal({ isOpen, onClose, onSubmit, initialData, categories }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      await onSubmit(data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Edit Task' : 'Create New Task'}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <TaskForm
        onSubmit={handleSubmit}
        initialData={initialData}
        categories={categories}
        loading={loading}
      />
    </Modal>
  )
}