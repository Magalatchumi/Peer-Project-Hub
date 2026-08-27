import api from './api'

export const projectService = {
  async getAll({ search, category, status, difficulty, page = 1, limit = 9 } = {}) {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (status) params.append('status', status)
    if (difficulty) params.append('difficulty', difficulty)
    params.append('page', page)
    params.append('limit', limit)

    const res = await api.get(`/projects?${params.toString()}`)
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/projects/${id}`)
    return res.data.project
  },

  async create(projectData) {
    const res = await api.post('/projects', projectData)
    return res.data.project
  },

  async update(id, projectData) {
    const res = await api.put(`/projects/${id}`, projectData)
    return res.data.project
  },

  async delete(id) {
    const res = await api.delete(`/projects/${id}`)
    return res.data
  },

  async getMyProjects() {
    const res = await api.get('/projects/my')
    return res.data.projects
  },

  async getUserProjects(userId) {
    const res = await api.get(`/projects/user/${userId}`)
    return res.data.projects
  },

  async toggleLike(id) {
    const res = await api.post(`/projects/${id}/like`)
    return res.data
  },

  async addComment(id, text) {
    const res = await api.post(`/projects/${id}/comments`, { text })
    return res.data
  },
}
