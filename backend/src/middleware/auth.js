import { getAuth } from '../config/firebase.js'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    req.firebaseUid = decodedToken.uid
    req.firebaseEmail = decodedToken.email

    const user = await User.findOne({ firebaseUid: decodedToken.uid })
    if (user) {
      req.user = user
    }

    next()
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}
