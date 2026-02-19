import { useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import StatsCard from '../components/dashboard/StatsCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { isPast, parseISO } from 'date-fns'

export default function Dashboard() {
    const { tasks, loading, error } = useTasks()

    const stats = useMemo(() => {
        const total = tasks.length
        const completed = tasks.filter(t => t.status === 'completed').length
        const pending = tasks.filter(t => t.status === 'pending').length
        const inProgress = tasks.filter(t => t.status === 'in_progress').length
        const overdue = tasks.filter(t =>
            t.due_date && isPast(parseISO(t.due_date)) && t.status !== 'completed'
        ).length
        return { total, completed, pending, inProgress, overdue }
    }, [tasks])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your tasks</p>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard title="Total Tasks" count={stats.total} icon="📋" color="blue" />
                    <StatsCard title="Completed" count={stats.completed} icon="✅" color="green" />
                    <StatsCard title="Pending" count={stats.pending} icon="⏳" color="yellow" />
                    <StatsCard title="Overdue" count={stats.overdue} icon="🚨" color="red" />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
                {loading ? <LoadingSpinner /> : (
                    tasks.slice(0, 5).length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No tasks yet. Go to Tasks to create one!</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks.slice(0, 5).map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-800 font-medium truncate flex-1">{task.title}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ml-3 whitespace-nowrap ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>{task.status.replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
