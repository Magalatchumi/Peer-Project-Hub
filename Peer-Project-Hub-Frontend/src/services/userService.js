import api from './api'

export const userService = {
  async register(name) {
    const res = await api.post('/users/register', { name })
    return res.data.user
  },

  async getMe() {
    const res = await api.get('/users/me')
    return res.data.user
  },

  async updateMe(profileData) {
    const res = await api.put('/users/me', profileData)
    return res.data.user
  },

  async getPublicProfile(userId) {
    const res = await api.get(`/users/${userId}`)
    return res.data.user
  },
}
