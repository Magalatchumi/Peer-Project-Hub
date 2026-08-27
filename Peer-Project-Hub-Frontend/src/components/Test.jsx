import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import StatusBadge from './ui/StatusBadge'
import TechBadge from './ui/TechBadge'
import Heading from './ui/Heading'

export default function Test() {
  return (
    <div className="p-8 bg-white">
      <Heading size="lg">Component Tests</Heading>
      
      <div className="mt-8 space-y-8">
        {/* Buttons */}
        <div>
          <Heading size="sm">Buttons</Heading>
          <div className="flex gap-4 mt-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </div>
        </div>
        
        {/* Cards */}
        <div>
          <Heading size="sm">Cards</Heading>
          <Card className="p-6 w-80 mt-4">
            <h3 className="font-bold">Sample Card</h3>
            <p className="text-body-sm mt-2">This is a test card component</p>
          </Card>
        </div>
        
        {/* Badges */}
        <div>
          <Heading size="sm">Badges</Heading>
          <div className="flex gap-4 mt-4">
            <Badge variant="blue">Blue Badge</Badge>
            <Badge variant="green">Green Badge</Badge>
            <Badge variant="yellow">Yellow Badge</Badge>
            <Badge variant="gray">Gray Badge</Badge>
          </div>
        </div>
        
        {/* Status Badges */}
        <div>
          <Heading size="sm">Status Badges</Heading>
          <div className="flex gap-4 mt-4">
            <StatusBadge status="Completed" />
            <StatusBadge status="In Progress" />
            <StatusBadge status="Open for Collaboration" />
          </div>
        </div>
        
        {/* Tech Badges */}
        <div>
          <Heading size="sm">Tech Badges</Heading>
          <div className="flex gap-2 mt-4 flex-wrap">
            <TechBadge tech="React" clickable />
            <TechBadge tech="Node.js" clickable />
            <TechBadge tech="MongoDB" clickable />
            <TechBadge tech="Tailwind CSS" clickable />
          </div>
        </div>
      </div>
    </div>
  )
}