import { Search, X } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar({ onSearch = () => {} }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search projects by title or description..."
          className="input-field w-full pl-12 pr-12"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
}