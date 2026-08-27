export default function Card({ 
  children, 
  hover = true,
  className = '',
  ...props 
}) {
  const hoverClass = hover ? 'hover:shadow-md hover:border-gray-300' : ''
  
  return (
    <div
      className={`card ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}