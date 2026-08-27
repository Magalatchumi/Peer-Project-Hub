import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="section-py container-max text-center bg-white dark:bg-gray-950">
      <h1 className="text-display-md mb-4">404</h1>
      <p className="text-body-lg mb-8">Page not found</p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  )
}