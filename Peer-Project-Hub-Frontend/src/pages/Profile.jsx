import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import Badge from '../components/ui/Badge'
import EditProfileModal from '../components/EditProfileModal'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { projectService } from '../services/projectService'

export default function Profile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const isOwnProfile = currentUser && currentUser._id === id

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        let profileData
        if (isOwnProfile) {
          profileData = currentUser
        } else {
          profileData = await userService.getPublicProfile(id)
        }

        const projects = await projectService.getUserProjects(id)

        if (!cancelled) {
          setProfile(profileData)
          setUserProjects(projects)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id, currentUser, isOwnProfile])

  const avatarUrl = profile?.avatar
    ? profile.avatar
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <Heading size="lg">User not found</Heading>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={avatarUrl}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg flex-shrink-0 object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <Heading size="lg">{profile.name}</Heading>
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              {profile.bio && (
                <p className="text-body-lg text-gray-600 dark:text-gray-400 mb-4 max-w-xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-8 mb-6">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black text-blue-600">
                    {userProjects.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary">Follow</Button>
                  <Button variant="secondary">Message</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {profile.skills && profile.skills.length > 0 && (
        <section className="section-py bg-gray-50 dark:bg-gray-900">
          <div className="container-max">
            <Heading size="sm" className="mb-4">
              Skills & Technologies
            </Heading>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="blue">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {(profile.github || profile.linkedin || profile.portfolio) && (
        <section className="section-py bg-white dark:bg-gray-950">
          <div className="container-max">
            <Heading size="sm" className="mb-4">
              Links
            </Heading>
            <div className="flex flex-col sm:flex-row gap-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section-py bg-gray-50 dark:bg-gray-900">
        <div className="container-max">
          <Heading size="sm" className="mb-6">
            {profile.name}'s Projects
          </Heading>
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-all">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>👁️ {project.views}</span>
                      <span>❤️ {project.likes}</span>
                      <span>⭐ {project.rating}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No projects yet.</p>
          )}
        </div>
      </section>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={profile}
      />
    </div>
  )
}
