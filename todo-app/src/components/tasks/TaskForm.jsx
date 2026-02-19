import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed']

export default function TaskForm({
  onSubmit,
  initialData = {},
  categories = [],
  loading
}) {

  const buildInitialState = (data = {}) => ({
    title: data?.title || '',
    description: data?.description || '',
    status: data?.status || 'pending',
    category_id: data?.category_id || '',
    tags: data?.task_tags
      ? data.task_tags.map(t => t.tag_name).join(', ')
      : '',
    due_date: data?.due_date
      ? data.due_date.slice(0, 16)
      : ''
  })

  const [form, setForm] = useState(buildInitialState(initialData))
  const [errors, setErrors] = useState({})

  // 🔥 รองรับตอน edit แล้ว initialData เปลี่ยน
  useEffect(() => {
    setForm(buildInitialState(initialData))
  }, [initialData])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const tagsArray = form.tags
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      due_date: form.due_date || null,
      category_id: form.category_id || null,
      tags: tagsArray,
    })
  }

  const field = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          value={form.title}
          onChange={e => field('title', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? 'border-red-400' : ''
          }`}
          placeholder="Task title..."
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={e => field('description', e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Optional description..."
        />
      </div>

      {/* Status + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={e => field('status', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={form.category_id}
            onChange={e => field('category_id', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="datetime-local"
          value={form.due_date}
          onChange={e => field('due_date', e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          value={form.tags}
          onChange={e => field('tags', e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. urgent, frontend, bug"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading
          ? 'Saving...'
          : initialData?.id
          ? 'Update Task'
          : 'Create Task'}
      </button>

    </form>
  )
}
