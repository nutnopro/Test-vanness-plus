export default function TaskFilters({ filters, setFilters, categories }) {
  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={filters.search || ''}
        onChange={e => update('search', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
      />
      <select
        value={filters.status || ''}
        onChange={e => update('status', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={filters.category_id || ''}
        onChange={e => update('category_id', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.overdue || false}
          onChange={e => update('overdue', e.target.checked)}
          className="rounded text-indigo-600"
        />
        Overdue Only
      </label>
      <button
        onClick={() => setFilters({})}
        className="text-xs text-gray-500 hover:text-gray-700 underline ml-auto"
      >
        Clear filters
      </button>
    </div>
  )
}