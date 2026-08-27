import { Router } from 'express'
import {
  createProject, getAllProjects, getProjectById,
  updateProject, deleteProject, getMyProjects,
  toggleLike, getUserProjects, addComment,
} from '../controllers/projectController.js'
import { authenticate, requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllProjects)
router.get('/my', authenticate, requireAuth, getMyProjects)
router.get('/:id', getProjectById)
router.post('/', authenticate, requireAuth, createProject)
router.put('/:id', authenticate, requireAuth, updateProject)
router.delete('/:id', authenticate, requireAuth, deleteProject)
router.post('/:id/like', authenticate, requireAuth, toggleLike)
router.post('/:id/comments', authenticate, requireAuth, addComment)
router.get('/user/:userId', getUserProjects)

export default router
