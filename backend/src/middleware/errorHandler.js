export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err)

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ error: 'Validation error', details: messages })
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({ error: `A record with that ${field} already exists` })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}
