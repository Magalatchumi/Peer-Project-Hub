export function calculateCompletenessScore(project) {
  const requiredFields = {
    title: project.title?.trim().length > 0,
    description: project.description?.trim().length > 0,
    category: project.category && project.category.length > 0,
    technologies: project.technologies && project.technologies.length > 0,
    imageUrl: project.imageUrl?.trim().length > 0,
    github: project.github?.trim().length > 0,
    liveDemo: project.liveDemo?.trim().length > 0,
  }

  const optionalFields = {
    screenshots: project.screenshots && project.screenshots.length > 0,
    difficulty: project.difficulty && project.difficulty.length > 0,
    status: project.status && project.status.length > 0,
  }

  const requiredCount = Object.values(requiredFields).filter(Boolean).length
  const optionalCount = Object.values(optionalFields).filter(Boolean).length

  const totalRequired = Object.keys(requiredFields).length
  const totalOptional = Object.keys(optionalFields).length

  const score = Math.round(
    ((requiredCount / totalRequired) * 0.7 + (optionalCount / totalOptional) * 0.3) * 100
  )

  return {
    score: Math.min(score, 100),
    requiredComplete: requiredCount === totalRequired,
    missingRequired: Object.entries(requiredFields)
      .filter(([_, complete]) => !complete)
      .map(([field]) => field),
    missingOptional: Object.entries(optionalFields)
      .filter(([_, complete]) => !complete)
      .map(([field]) => field),
  }
}

export function getCompletenessMessage(score) {
  if (score === 100) return '✅ Perfect! Ready to publish'
  if (score >= 80) return '🟢 Almost there! Add a few more details'
  if (score >= 60) return '🟡 Good start! Fill in more information'
  if (score >= 40) return '🟠 Add more details to improve visibility'
  return '🔴 Fill in required fields to continue'
}

export function getScoreColor(score) {
  if (score === 100) return 'bg-green-100 text-green-700'
  if (score >= 80) return 'bg-blue-100 text-blue-700'
  if (score >= 60) return 'bg-yellow-100 text-yellow-700'
  if (score >= 40) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}