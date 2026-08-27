import { X } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Heading from './ui/Heading'
import StatusBadge from './ui/StatusBadge'
import TechBadge from './ui/TechBadge'
import Badge from './ui/Badge'

export default function ProjectPreviewModal({ isOpen, onClose, onPublish, project, isLoading }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <Heading size="sm">Project Preview</Heading>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Title */}
          <div>
            <Heading size="sm">{project.title}</Heading>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {project.status && <StatusBadge status={project.status} />}
            {project.difficulty && (
              <Badge variant="yellow">
                {project.difficulty === 'Advanced' ? '🔴' : project.difficulty === 'Intermediate' ? '🟡' : '🟢'} {project.difficulty}
              </Badge>
            )}
            {project.category && <Badge variant="gray">📂 {project.category}</Badge>}
          </div>

          {/* Description */}
          <div>
              <p className="text-body-base text-gray-700 dark:text-gray-300">{project.description}</p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                🐙 GitHub
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                🌐 Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Edit
          </Button>
          <Button variant="primary" onClick={onPublish} disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish Project'}
          </Button>
        </div>
      </Card>
    </div>
  )
}