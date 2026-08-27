import Card from '../components/ui/Card'
import Heading from '../components/ui/Heading'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <Heading size="lg">About Peer Project Hub</Heading>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            A community platform built by students, for students
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-py">
        <div className="container-max max-w-3xl">
          <Card className="p-8 mb-8">
            <Heading size="sm" className="mb-4">Our Mission</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400">
              Peer Project Hub is a vibrant community where student developers showcase their work, 
              discover amazing projects, and collaborate with peers. We believe in the power of 
              learning through building and sharing.
            </p>
          </Card>

          <Card className="p-8 mb-8">
            <Heading size="sm" className="mb-4">Why We Built This</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 mb-4">
              Student projects often go unnoticed. We created Peer Project Hub to:
            </p>
            <ul className="space-y-3 text-body-lg text-gray-600 dark:text-gray-400">
              <li>✅ Give students a platform to showcase their work</li>
              <li>✅ Help developers discover projects and learn from peers</li>
              <li>✅ Enable collaboration between like-minded developers</li>
              <li>✅ Build a supportive community of innovators</li>
            </ul>
          </Card>

          <Card className="p-8 mb-8">
            <Heading size="sm" className="mb-4">Community Stats</Heading>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-black text-blue-600">6+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Projects</p>
              </div>
              <div>
                <p className="text-4xl font-black text-blue-600">500+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Developers</p>
              </div>
              <div>
                <p className="text-4xl font-black text-blue-600">1.2K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Collaborations</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            <Heading size="sm" className="mb-4">Ready to Join?</Heading>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 mb-6">
              Showcase your projects and connect with developers today
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Get Started Now
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}