import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Code2, Users, Zap, Globe, TrendingUp } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatusBadge from '../components/ui/StatusBadge'
import TechBadge from '../components/ui/TechBadge'
import Heading from '../components/ui/Heading'
import { projectService } from '../services/projectService'
import { mockProjects, mockTechnologies, mockCategories } from '../data/mockData'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await projectService.getAll({ limit: 3 })
        if (!cancelled) {
          setFeaturedProjects(data.projects)
          setTotalProjects(data.pagination.total)
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const heroProjects = featuredProjects.length > 0
    ? featuredProjects.slice(0, 2)
    : mockProjects.slice(0, 2)

  const heroProjectsDisplay = heroProjects.map(p => ({
    title: p.title,
    image: p.imageUrl || p.image,
    views: p.views,
    likes: p.likes,
    owner: p.owner || { name: p.author?.name, avatar: p.author?.avatar },
  }))

  return (
    <div className="bg-white dark:bg-gray-950">
           {/* ===== HERO SECTION ===== */}
      <section className="relative section-py overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-950 dark:via-gray-950 dark:to-gray-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container-max relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slideUp">
              <div className="space-y-4">
                <div className="inline-block mb-4">
                  <Badge variant="blue">
                    Built by Students. For Everyone.
                  </Badge>
                </div>
                  <h1 className="text-display-lg font-black text-black dark:text-white leading-tight tracking-tight">
                  Build.
                  <br />
                  Share.
                  <br />
                  <span className="text-blue-600">Connect.</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg font-medium">
                  Discover, showcase and collaborate on projects built by student developers. Join a thriving community of innovators.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/explore">
                  <Button variant="primary" size="lg">
                    <Zap size={20} />
                    Explore Projects
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/create-project">
                  <Button variant="secondary" size="lg">
                    <Code2 size={20} />
                    Share Your Project
                  </Button>
                </Link>
              </div>

              <div className="flex gap-12 pt-8 border-t border-gray-300 dark:border-gray-700">
                <div>
                  <p className="text-5xl font-black text-blue-600">{totalProjects}+</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 font-semibold">Student Projects</p>
                </div>
                <div>
                  <p className="text-5xl font-black text-blue-600">500+</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 font-semibold">Active Developers</p>
                </div>
                <div>
                  <p className="text-5xl font-black text-blue-600">1.2K+</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 font-semibold">Collaborations</p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="space-y-4">
                {heroProjectsDisplay.map((project, idx) => (
                  <div
                    key={idx}
                    className="transform transition-transform hover:scale-105 duration-300"
                    style={{
                      transform: idx === 0 ? 'rotate(-3deg) translateY(-20px)' : 'rotate(3deg) translateY(20px)',
                    }}
                  >
                    <Card className="overflow-hidden shadow-xl border-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-black text-gray-900 dark:text-white text-lg">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-3">
                          <img
                            src={project.owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.owner?.email}`}
                            alt={project.owner?.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{project.owner?.name}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-600 dark:text-gray-400 font-medium">
                          <span>👁️ {project.views?.toLocaleString()} views</span>
                          <span>❤️ {project.likes} likes</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="section-py bg-blue-50 dark:bg-gray-900">
        <div className="container-max">
          <div className="mb-12">
            <Heading size="lg">Featured Projects</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
              Explore the most impressive projects from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProjects.slice(0, 3).map((project) => (
              <Link key={project._id} to={`/project/${project._id}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-heading-sm font-bold text-gray-900 dark:text-white flex-1">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                    </div>
                    <div className="mb-4">
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span>👁️ {project.views?.toLocaleString()}</span>
                      <span>❤️ {project.likes}</span>
                      <span>⭐ {project.rating}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/explore">
              <Button variant="outline" size="lg">
                View All Projects
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TECHNOLOGY EXPLORER ===== */}
      <section className="section-py bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="mb-12">
            <Heading size="lg">Explore by Technology</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
              Find projects built with your favorite tech stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {mockTechnologies.map((tech) => (
              <Link key={tech.name} to={`/explore?tech=${tech.name}`}>
                <Card className="p-6 text-center h-full hover:border-blue-400 transition-colors cursor-pointer">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{tech.name}</h3>
                  <p className="text-2xl font-black text-blue-600">{tech.count}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Projects</p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/technologies">
              <Button variant="secondary" size="lg">
                Explore All Technologies
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-py bg-blue-50 dark:bg-gray-900">
        <div className="container-max">
          <div className="text-center mb-16">
            <Heading size="lg">How It Works</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
              Four simple steps to showcase your talent and connect with developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", icon: Code2, title: "Build", desc: "Create amazing projects and push code to GitHub" },
              { num: "2", icon: Sparkles, title: "Share", desc: "Upload your project with screenshots and details" },
              { num: "3", icon: Globe, title: "Discover", desc: "Your project gets discovered by the community" },
              { num: "4", icon: Users, title: "Collaborate", desc: "Connect and collaborate with other developers" },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={idx}>
                  <Card className="p-6 h-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                      <Icon className="text-blue-600 dark:text-blue-300" size={24} />
                    </div>
                    <h3 className="text-heading-sm font-bold text-gray-900 dark:text-white mb-2">
                      {step.num}. {step.title}
                    </h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== BROWSE BY CATEGORY ===== */}
      <section className="section-py bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="mb-12">
            <Heading size="lg">Browse by Category</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
              Discover projects in your area of interest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCategories.slice(0, 6).map((cat) => (
              <Link key={cat.name} to={`/explore?category=${cat.name}`}>
                <Card className="p-6 h-full hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-5xl mb-4">{cat.icon}</div>
                  <h3 className="text-heading-sm font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-4">{cat.description}</p>
                  <p className="text-blue-600 font-bold text-sm">
                    {cat.count} Projects
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FIND COLLABORATORS ===== */}
      <section className="section-py bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Heading size="lg">Find Your Collaborators</Heading>
              <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-4 mb-8">
                Stop building alone. Discover students working on similar projects and collaborate together.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="text-3xl">👀</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Discover</h4>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">Browse projects open for collaboration</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">📨</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Request</h4>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">Send a collaboration request with a message</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Connect</h4>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">Project owner accepts and you start building</p>
                  </div>
                </div>
              </div>

              <Link to="/explore">
                <Button variant="primary" size="lg">
                  Find Collaborators
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Trending This Week
              </h3>
              <div className="space-y-4">
                {featuredProjects.slice(0, 3).map((project) => (
                  <div key={project._id} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <Link to={`/project/${project._id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                      {project.title}
                    </Link>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>👁️ {project.views}</span>
                      <span>❤️ {project.likes}</span>
                      <span>⭐ {project.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section className="section-py bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="text-center mb-16">
            <Heading size="lg">Join the Developer Community</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
              More than just a project showcase. A thriving ecosystem where developers learn, build, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💬", title: "Get Feedback", desc: "Receive constructive comments and ratings" },
              { icon: "🎓", title: "Learn from Others", desc: "Discover how students built amazing projects" },
              { icon: "⭐", title: "Get Recognized", desc: "Build your reputation with likes and ratings" },
            ].map((item, idx) => (
              <Card key={idx} className="p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-heading-md font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-body-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section-py bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-max text-center">
          <Heading size="xl" className="text-white mb-4">
            Your Next Project Deserves to Be Seen
          </Heading>
          <p className="text-body-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Share your work, get feedback, collaborate with peers, and build your developer reputation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Explore Projects
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
