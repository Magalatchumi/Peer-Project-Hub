import Badge from './Badge'

export default function DifficultyBadge({ difficulty = 'Intermediate' }) {
  const config = {
    'Beginner': { variant: 'green', emoji: '🟢' },
    'Intermediate': { variant: 'yellow', emoji: '🟡' },
    'Advanced': { variant: 'red', emoji: '🔴' },
  }

  const { variant, emoji } = config[difficulty] || config['Intermediate']

  return (
    <Badge variant={variant}>
      {emoji} {difficulty}
    </Badge>
  )
}