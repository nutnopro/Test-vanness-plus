import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useCategories } from '../hooks/useCategories'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'
import TaskFilters from '../components/tasks/TaskFilters'
import CategoryModal from '../components/categories/CategoryModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function TaskList() {
    const [filters, setFilters] = useState({})
    const { tasks, loading, error, createTask, updateTask, updateStatus, deleteTask } = useTasks(filters)
    const { categories, createCategory, deleteCategory } = useCategories()

    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const [catModalOpen, setCatModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    const handleOpenCreate = () => { setEditingTask(null); setTaskModalOpen(true) }
    const handleEdit = (task) => { setEditingTask(task); setTaskModalOpen(true) }

    const handleSubmit = async (data) => {
        if (editingTask) {
            await updateTask(editingTask.id, data)
        } else {
            await createTask(data)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-gray-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setCatModalOpen(true)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                        📁 Categories
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        + New Task
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <TaskFilters filters={filters} setFilters={setFilters} categories={categories} />
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            {loading ? (
                <LoadingSpinner />
            ) : tasks.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="No tasks found"
                    description="Create your first task or adjust your filters"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={deleteTask}
                            onStatusChange={updateStatus}
                        />
                    ))}
                </div>
            )}

            <TaskModal
                isOpen={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingTask}
                categories={categories}
            />

            <CategoryModal
                isOpen={catModalOpen}
                onClose={() => setCatModalOpen(false)}
                onCreate={createCategory}
                onDelete={deleteCategory}
                categories={categories}
            />
        </div>
    )
}
