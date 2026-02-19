import { useState } from 'react'
import { format, isPast, parseISO } from 'date-fns'
import CategoryBadge from '../categories/CategoryBadge'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed']

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [deleting, setDeleting] = useState(false)
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && task.status !== 'completed'

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    setDeleting(true)
    try { await onDelete(task.id) }
    catch (e) { console.error(e) }
    finally { setDeleting(false) }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : ''}`}>
      {isOverdue && (
        <div className="text-xs text-red-500 font-medium mb-2">⚠️ Overdue</div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[task.status]}`}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {task.categories && <CategoryBadge name={task.categories.name} />}
        {task.task_tags?.map(tag => (
          <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
            #{tag.tag_name}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {task.due_date && (
            <span className={isOverdue ? 'text-red-500' : ''}>
              📅 Due: {format(parseISO(task.due_date), 'MMM d, yyyy HH:mm')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}