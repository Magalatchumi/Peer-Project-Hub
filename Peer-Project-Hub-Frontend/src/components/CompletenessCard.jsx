import Card from './ui/Card'
import Heading from './ui/Heading'
import { calculateCompletenessScore, getCompletenessMessage, getScoreColor } from '../utils/completenessScore'

export default function CompletenessCard({ project }) {
  const { score, missingRequired, missingOptional } = calculateCompletenessScore(project)
  const message = getCompletenessMessage(score)
  const colorClass = getScoreColor(score)

  return (
    <Card className="p-6 sticky top-24">
      <Heading size="xs" className="mb-4">Project Completeness</Heading>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="#0284c7"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 345.6} 345.6`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-blue-600">{score}%</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Complete</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className={`p-3 rounded-lg ${colorClass} text-center text-sm font-semibold mb-4`}>
        {message}
      </div>

      {/* Missing Fields */}
      {missingRequired.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-red-700 mb-2">⚠️ Required:</p>
          <ul className="space-y-1">
            {missingRequired.map(field => (
              <li key={field} className="text-xs text-red-600 capitalize">
                • {field.replace(/([A-Z])/g, ' $1').trim()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional Fields */}
      {missingOptional.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 Optional:</p>
          <ul className="space-y-1">
            {missingOptional.map(field => (
              <li key={field} className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                • {field.replace(/([A-Z])/g, ' $1').trim()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}