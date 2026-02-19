export default function EmptyState({
  title = 'No data found',
  description = '',
  icon = '📭',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white border rounded-xl shadow-sm">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-2 text-sm max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
