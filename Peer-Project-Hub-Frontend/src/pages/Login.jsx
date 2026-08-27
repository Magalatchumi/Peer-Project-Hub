import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const message = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : err.code === 'auth/wrong-password'
            ? 'Incorrect password'
            : 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <Heading size="md" className="text-center mb-2">Welcome Back</Heading>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Sign in to your account</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <Button variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 dark:hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
