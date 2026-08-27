import { Router } from 'express'
import { register, getProfile, updateProfile, getPublicProfile } from '../controllers/userController.js'
import { authenticate, requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', authenticate, register)
router.get('/me', authenticate, requireAuth, getProfile)
router.put('/me', authenticate, requireAuth, updateProfile)
router.get('/:id', getPublicProfile)

export default router
