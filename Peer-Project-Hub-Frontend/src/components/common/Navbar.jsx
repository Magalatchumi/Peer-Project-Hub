import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, Home, User, Settings, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Explore', href: '/explore' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'About', href: '/about' },
  ]

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">PPH</div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 hidden sm:block">
              <div>Peer Project</div>
              <div>Hub</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              // Logged In - Profile Dropdown
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <Link
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={18} />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Home size={18} />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/create-project"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={18} />
                      <span className="text-sm font-medium">Create Project</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X size={24} className="text-gray-900 dark:text-gray-100" />
              ) : (
                <Menu size={24} className="text-gray-900 dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 pt-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link to={`/profile/${user.id}`} className="block">
                    <Button variant="secondary" size="sm" fullWidth>
                      My Profile
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="block">
                    <Button variant="secondary" size="sm" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/create-project" className="block">
                    <Button variant="secondary" size="sm" fullWidth>
                      Create Project
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="secondary" size="sm" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button variant="primary" size="sm" fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}