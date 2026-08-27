import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import CompletenessCard from '../components/CompletenessCard'
import ProjectPreviewModal from '../components/ProjectPreviewModal'
import { projectService } from '../services/projectService'

export default function CreateProject() {
  const navigate = useNavigate()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

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

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [newTech, setNewTech] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setImageError('Please select a JPG, JPEG, PNG, or WEBP image file.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
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
    if (!imageFile) {
      setImageError('Please select an image for your project.')
      return
    }

    setIsSubmitting(true)

    const uploadPromise = (async () => {
      const storageRef = ref(storage, `project-images/${Date.now()}-${imageFile.name}`)
      const snapshot = await uploadBytes(storageRef, imageFile)
      return getDownloadURL(snapshot.ref)
    })()

    let imageUrl = ''
    try {
      imageUrl = await Promise.race([
        uploadPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image upload timed out')), 3000)),
      ])
    } catch (uploadErr) {
      console.warn('Image upload failed, publishing with embedded image:', uploadErr)
    }

    if (!imageUrl) {
      try {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(imageFile)
        })
      } catch (readErr) {
        console.warn('Could not embed image, publishing without it:', readErr)
      }
    }

    try {
      await projectService.create({ ...formData, imageUrl })
      setPreviewOpen(false)
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to publish project:', err)
      alert('Failed to publish project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <Heading size="lg">Create New Project</Heading>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
            Share your project with the community
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
                  Project Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, JPEG, PNG, or WEBP. Max 5MB.</p>

                {imageError && (
                  <p className="text-xs text-red-600 mt-2">{imageError}</p>
                )}

                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-[500px] object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white dark:bg-gray-900 text-red-600 text-xs font-semibold px-2 py-1 rounded shadow hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Remove
                    </button>
                  </div>
                )}
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
                  Preview Project
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </div>

            <CompletenessCard project={{ ...formData, imageUrl: imagePreview || formData.imageUrl }} />
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onPublish={handlePublish}
        project={{ ...formData, imageUrl: imagePreview || formData.imageUrl }}
        isLoading={isSubmitting}
      />
    </div>
  )
}
