import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Card from './ui/Card'
import Badge from './ui/Badge'

export default function FilterPanel({ onFilterChange = () => {} }) {
  const [expandedFilter, setExpandedFilter] = useState(null)
  const [filters, setFilters] = useState({
    category: [],
    status: [],
    difficulty: [],
  })

  const categories = [
    'Web Development',
    'AI / ML',
    'Mobile Apps',
    'IoT',
    'Blockchain',
    'Cloud',
  ]

  const statuses = ['Completed', 'In Progress', 'Open for Collaboration']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  const handleFilterToggle = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType].includes(value)
        ? filters[filterType].filter(v => v !== value)
        : [...filters[filterType], value],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearAll = () => {
    setFilters({ category: [], status: [], difficulty: [] })
    onFilterChange({ category: [], status: [], difficulty: [] })
  }

  const totalActive = Object.values(filters).flat().length

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
          {totalActive > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-semibold"
            >
              Clear All ({totalActive})
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-4">
          <button
            onClick={() =>
              setExpandedFilter(expandedFilter === 'category' ? null : 'category')
            }
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="font-semibold text-gray-900 dark:text-white">Category</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedFilter === 'category' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedFilter === 'category' && (
            <div className="px-3 py-2 space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat)}
                    onChange={() => handleFilterToggle('category', cat)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-4">
          <button
            onClick={() =>
              setExpandedFilter(expandedFilter === 'status' ? null : 'status')
            }
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="font-semibold text-gray-900 dark:text-white">Status</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedFilter === 'status' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedFilter === 'status' && (
            <div className="px-3 py-2 space-y-2">
              {statuses.map((status) => (
                <label key={status} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleFilterToggle('status', status)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <button
            onClick={() =>
              setExpandedFilter(expandedFilter === 'difficulty' ? null : 'difficulty')
            }
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="font-semibold text-gray-900 dark:text-white">Difficulty</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                expandedFilter === 'difficulty' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedFilter === 'difficulty' && (
            <div className="px-3 py-2 space-y-2">
              {difficulties.map((diff) => (
                <label key={diff} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(diff)}
                    onChange={() => handleFilterToggle('difficulty', diff)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{diff}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Active Filters Display */}
      {totalActive > 0 && (
        <Card className="p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-3">ACTIVE FILTERS</p>
          <div className="flex flex-wrap gap-2">
            {[...filters.category, ...filters.status, ...filters.difficulty].map(
              (filter) => (
                <Badge key={filter} variant="blue" className="cursor-pointer">
                  {filter} ×
                </Badge>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  )
}