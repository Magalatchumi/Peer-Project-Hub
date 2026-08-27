import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import CompletenessCard from '../components/CompletenessCard'
import ProjectPreviewModal from '../components/ProjectPreviewModal'
import { projectService } from '../services/projectService'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Intermediate',
    status: 'In Progress',
    technologies: [],
    imageUrl: '',
    github: '',
    liveDemo: '',
    screenshots: [],
  })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const project = await projectService.getById(id)
        if (!cancelled) {
          setFormData({
            title: project.title || '',
            description: project.description || '',
            category: project.category || '',
            difficulty: project.difficulty || 'Intermediate',
            status: project.status || 'In Progress',
            technologies: project.technologies || [],
            imageUrl: project.imageUrl || '',
            github: project.github || '',
            liveDemo: project.liveDemo || '',
            screenshots: project.screenshots || [],
          })
        }
      } catch (err) {
        console.error('Failed to load project:', err)
        alert('Failed to load project')
        navigate('/dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, navigate])

  const [newTech, setNewTech] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== techToRemove)
    }))
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      await projectService.update(id, formData)
      setPreviewOpen(false)
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to save project:', err)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <Heading size="lg">Edit Project</Heading>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
            Update your project details
          </p>
        </div>
      </section>

      <section className="section-py">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="My Awesome Project"
                  className="input-field"
                />
              </Card>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project..."
                  rows="4"
                  className="input-field textarea-base"
                />
              </Card>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Project Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="IoT">IoT</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </Card>

                <Card className="p-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </Card>
              </div>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Project Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Open for Collaboration">Open for Collaboration</option>
                </select>
              </Card>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Technologies *
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                    placeholder="Add a technology (e.g., React)"
                    className="input-field flex-1"
                  />
                  <Button variant="secondary" onClick={handleAddTech}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map(tech => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-blue-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  GitHub Repository *
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                  className="input-field"
                />
              </Card>

              <Card className="p-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Live Demo URL *
                </label>
                <input
                  type="url"
                  name="liveDemo"
                  value={formData.liveDemo}
                  onChange={handleInputChange}
                  placeholder="https://your-project.com"
                  className="input-field"
                />
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePreview}
                >
                  Preview Changes
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </div>

            <CompletenessCard project={formData} />
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onPublish={handlePublish}
        project={formData}
        isLoading={isSubmitting}
      />
    </div>
  )
}
