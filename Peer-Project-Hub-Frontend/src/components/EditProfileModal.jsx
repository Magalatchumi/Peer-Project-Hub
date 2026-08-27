import { useState } from 'react'
import { X } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Heading from './ui/Heading'
import Badge from './ui/Badge'
import { useAuth } from '../context/AuthContext'

export default function EditProfileModal({ isOpen, onClose, user }) {
  const { updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    avatar: user?.avatar || null,
  })
  const [newSkill, setNewSkill] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result
        setAvatarPreview(base64)
        setFormData(prev => ({ ...prev, avatar: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(formData)
      onClose()
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <Heading size="sm">Edit Profile</Heading>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block text-sm text-gray-700 dark:text-gray-300 mb-2 cursor-pointer"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">JPG, PNG, or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              maxLength="160"
              className="input-field textarea-base"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formData.bio.length}/160</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Skills & Technologies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill (e.g., React)"
                className="input-field flex-1"
              />
              <Button variant="secondary" size="sm" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <Badge key={skill} variant="blue" className="cursor-pointer">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">GitHub Profile</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/username"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Portfolio Website</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
              className="input-field"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
