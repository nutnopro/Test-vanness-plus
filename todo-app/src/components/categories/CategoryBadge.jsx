export default function CategoryBadge({ name }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      📁 {name}
    </span>
  )
}