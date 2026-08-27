import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, Bookmark, MessageCircle, Eye, Share2, Code2, Globe, ArrowLeft, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Heading from '../components/ui/Heading'
import StatusBadge from '../components/ui/StatusBadge'
import TechBadge from '../components/ui/TechBadge'
import { projectService } from '../services/projectService'
import { useAuth } from '../context/AuthContext'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [project, setProject] = useState(null)
  const [similarProjects, setSimilarProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await projectService.getById(id)
        if (!cancelled) {
          setProject(data)
          const similar = await projectService.getAll({ category: data.category, limit: 3 })
          if (!cancelled) {
            setSimilarProjects(similar.projects.filter(p => p._id !== data._id).slice(0, 3))
          }
        }
      } catch (err) {
        console.error('Failed to load project:', err)
        if (!cancelled) setProject(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleLike = async () => {
    try {
      const result = await projectService.toggleLike(id)
      setLiked(result.liked)
      setProject(prev => ({ ...prev, likes: result.project.likes }))
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch (err) {
      try {
        const input = document.createElement('textarea')
        input.value = window.location.href
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(true)
      } catch (err2) {
        console.error('Failed to copy link:', err2)
      }
    }
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    const text = commentText.trim()
    if (!text || postingComment) return
    setPostingComment(true)
    setCommentError('')
    try {
      const result = await projectService.addComment(id, text)
      setProject(prev => ({ ...prev, comments: [...(prev.comments || []), result.comment] }))
      setCommentText('')
    } catch (err) {
      console.error('Failed to post comment:', err)
      setCommentError('Failed to post comment. Please try again.')
    } finally {
      setPostingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="section-py container-max text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="section-py container-max text-center">
        <div className="text-6xl mb-4">❌</div>
        <Heading size="lg">Project not found</Heading>
        <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-4">This project doesn't exist or has been removed.</p>
        <div className="mt-8">
          <Button variant="primary" onClick={() => navigate('/explore')}>
            Back to Explore
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="container-max py-3">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Explore
          </button>
        </div>
      </div>

      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-display-md font-black text-black dark:text-white mb-4">
              {project.title}
            </h1>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <StatusBadge status={project.status} />
              <Badge variant={project.difficulty === 'Advanced' ? 'red' : project.difficulty === 'Intermediate' ? 'yellow' : 'green'}>
                {project.difficulty === 'Advanced' ? '🔴' : project.difficulty === 'Intermediate' ? '🟡' : '🟢'} {project.difficulty}
              </Badge>
              <Badge variant="gray">📂 {project.category}</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <img
                src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.email}`}
                alt={project.owner?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <Link to={`/profile/${project.owner?._id}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{project.owner?.name}</Link>
                <p className="text-xs text-gray-600 dark:text-gray-400">Project Creator</p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Eye size={18} />
                <span className="font-semibold">{project.views?.toLocaleString()}</span>
                <span className="text-sm">views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Heart size={18} />
                <span className="font-semibold">{project.likes}</span>
                <span className="text-sm">likes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Star size={18} />
                <span className="font-semibold">{project.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <Heading size="sm" className="mb-4">Technologies Used</Heading>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech, i) => (
                    <TechBadge key={i} tech={tech} />
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <Heading size="sm" className="mb-4">How Was This Built?</Heading>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase mb-1">Frontend</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{project.technologies?.[0] || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase mb-1">Backend</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{project.technologies?.[1] || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {project.imageUrl && (
                <Card className="p-6">
                  <Heading size="sm" className="mb-4">Screenshots</Heading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img
                      src={project.imageUrl}
                      alt="Screenshot 1"
                      className="w-full h-64 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    />
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <Heading size="sm" className="mb-4">Comments</Heading>

                {project.comments && project.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {project.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3">
                        <img
                          src={comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.email}`}
                          alt={comment.user?.name}
                          className="w-9 h-9 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {comment.user?.name}
                            <span className="font-normal text-gray-500 dark:text-gray-400 ml-2 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                  </div>
                )}

                {user ? (
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      maxLength={500}
                      rows={3}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {commentError && <p className="text-sm text-red-600 mt-2">{commentError}</p>}
                    <div className="mt-3">
                      <Button
                        type="submit"
                        disabled={postingComment || !commentText.trim()}
                      >
                        {postingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
                    >
                      Log in to join the discussion
                    </Link>
                  </div>
                )}
              </Card>

              {similarProjects.length > 0 && (
                <div>
                  <Heading size="sm" className="mb-6">Similar Projects in {project.category}</Heading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarProjects.map((proj) => (
                      <Link key={proj._id} to={`/project/${proj._id}`}>
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-all">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">{proj.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">by {proj.owner?.name}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </main>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={handleLike}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${liked
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                    {liked ? 'Liked' : 'Like Project'}
                  </button>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${bookmarked
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                    {bookmarked ? 'Saved' : 'Bookmark'}
                  </button>

                  {project.status === 'Open for Collaboration' && (
                    <button className="w-full py-3 rounded-lg font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md flex items-center justify-center gap-2">
                      <MessageCircle size={20} />
                      Request Collaboration
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    className="w-full py-3 rounded-lg font-bold transition-all bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Share2 size={20} />
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>

                <Card className="p-6">
                  <Heading size="xs" className="mb-4">Links</Heading>
                  <div className="space-y-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Code2 size={18} />
                        View Code
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Globe size={18} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <Heading size="xs" className="mb-4">Stats</Heading>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                      <span className="font-bold text-gray-900 dark:text-white">{project.views?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Likes</span>
                      <span className="font-bold text-gray-900 dark:text-white">{project.likes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                      <span className="font-bold text-blue-600">⭐ {project.rating}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
