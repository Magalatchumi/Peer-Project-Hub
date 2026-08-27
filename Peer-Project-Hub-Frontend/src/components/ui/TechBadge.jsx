export default function TechBadge({ tech, onClick, clickable = false }) {
  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 ${
        clickable ? 'cursor-pointer hover:bg-blue-100 transition-colors' : ''
      }`}
    >
      {tech}
    </span>
  )
}