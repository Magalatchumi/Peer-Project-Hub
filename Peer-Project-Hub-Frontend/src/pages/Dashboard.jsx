import { useState, useEffect, useCallback } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    projectService.getMyProjects()
      .then(data => {
        if (!cancelled) setProjects(data)
      })
      .catch(err => {
        console.error('Failed to load projects:', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  const handleDelete = useCallback(async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(projectId)
        setProjects(prev => prev.filter(p => p._id !== projectId))
      } catch (err) {
        console.error('Failed to delete project:', err)
        alert('Failed to delete project')
      }
    }
  }, [])

  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0)

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <div className="flex items-center justify-between">
            <div>
              <Heading size="lg">Dashboard</Heading>
              <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user?.name}! Manage your projects here
              </p>
            </div>
            <a href="/create-project">
              <Button variant="primary" size="lg">
                + New Project
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="section-py bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-blue-600 mb-2">{projects.length}</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">My Projects</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-green-600 mb-2">{totalViews.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Total Views</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-purple-600 mb-2">{totalLikes.toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Total Likes</p>
            </Card>
          </div>

          <Heading size="sm" className="mb-6">My Projects</Heading>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-5xl mb-4">📁</div>
              <Heading size="sm" className="mb-2">No Projects Yet</Heading>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first project to showcase your work</p>
              <a href="/create-project">
                <Button variant="primary" size="lg">Create Project</Button>
              </a>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project._id} className="overflow-hidden flex flex-col">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover" />
                  <div className="p-4 flex-1 flex flex-col">
                    <a href={`/project/${project._id}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                      {project.title}
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-1">
                      {project.description.substring(0, 60)}...
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 py-3 border-t border-gray-200 dark:border-gray-700">
                      <span>👁️ {project.views || 0}</span>
                      <span>❤️ {project.likes || 0}</span>
                      <span>{project.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/edit-project/${project._id}`} className="flex-1">
                        <button className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/70 rounded-lg font-medium text-sm transition-colors">
                          ✏️ Edit
                        </button>
                      </a>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/70 rounded-lg font-medium text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
