import Badge from './Badge'

export default function StatusBadge({ status = 'In Progress' }) {
  const statusConfig = {
    'Completed': { variant: 'green', label: '✓ Completed' },
    'In Progress': { variant: 'yellow', label: '⏳ In Progress' },
    'Open for Collaboration': { variant: 'blue', label: '🤝 Open for Collaboration' },
  }
  
  const config = statusConfig[status] || statusConfig['In Progress']
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}