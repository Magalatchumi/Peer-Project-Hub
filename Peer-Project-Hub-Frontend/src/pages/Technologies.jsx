import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Heading from '../components/ui/Heading'
import Button from '../components/ui/Button'
import { mockTechnologies } from '../data/mockData'

export default function Technologies() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="section-py bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-max">
          <Heading size="lg">Explore Technologies</Heading>
          <p className="text-body-lg text-gray-600 dark:text-gray-400 mt-2">
            Find projects built with the technologies you love
          </p>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="section-py">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTechnologies.map((tech) => (
              <Link key={tech.name} to={`/explore?tech=${tech.name}`}>
                <Card className="p-8 text-center h-full hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-heading-md font-bold text-gray-900 dark:text-white mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-3xl font-black text-blue-600 mb-2">
                    {tech.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                  <Button variant="secondary" size="sm" className="mt-6 w-full">
                    Explore →
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}