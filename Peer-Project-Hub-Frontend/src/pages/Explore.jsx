import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatusBadge from '../components/ui/StatusBadge'
import TechBadge from '../components/ui/TechBadge'
import Heading from '../components/ui/Heading'
import Button from '../components/ui/Button'
import { projectService } from '../services/projectService'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: [],
    status: [],
    difficulty: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, pages: 1 })
  const [loading, setLoading] = useState(true)
  const projectsPerPage = 9

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        const params = {
          page: currentPage,
          limit: projectsPerPage,
        }
        if (searchQuery) params.search = searchQuery
        if (filters.category.length > 0) params.category = filters.category.join(',')
        if (filters.status.length > 0) params.status = filters.status.join(',')
        if (filters.difficulty.length > 0) params.difficulty = filters.difficulty.join(',')

        const data = await projectService.getAll(params)
        if (!cancelled) {
          setProjects(data.projects)
          setPagination(data.pagination)
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        if (!cancelled) setProjects([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [searchQuery, filters, currentPage])

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilters({ category: [], status: [], difficulty: [] })
    setCurrentPage(1)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * projectsPerPage

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <Heading size="lg">Explore Projects</Heading>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
            Discover amazing projects built by student developers
          </p>
        </div>
      </section>

      <section className="section-py bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <SearchBar onSearch={handleSearch} />
                <FilterPanel onFilterChange={handleFilterChange} />
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-heading-lg font-bold text-gray-900 dark:text-white">Results</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {loading ? (
                        'Loading...'
                      ) : (
                        <>
                          Showing {projects.length > 0 ? startIndex + 1 : 0} to{' '}
                          {Math.min(startIndex + projectsPerPage, pagination.total)} of{' '}
                          <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> projects
                        </>
                      )}
                    </p>
                  </div>
                  {(searchQuery || Object.values(filters).some(v => v.length > 0)) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
                </div>
              ) : projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {projects.map((project) => (
                      <Link key={project._id} to={`/project/${project._id}`}>
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-all">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-heading-sm font-bold text-gray-900 dark:text-white flex-1">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                      {project.technologies.length > 2 && (
                        <Badge variant="gray">+{project.technologies.length - 2}</Badge>
                      )}
                    </div>
                    <div className="mb-4">
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <img
                          src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.email}`}
                          alt={project.owner?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {project.owner?.name?.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ⭐ {project.rating}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-heading-md text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mb-8">
            Try adjusting your search or filters
          </p>
          <Button variant="primary" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}
