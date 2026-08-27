export default function Badge({ 
  children, 
  variant = 'gray',
  className = '',
  ...props 
}) {
  const variants = {
    blue: 'badge-blue',
    gray: 'badge-gray',
    green: 'badge-green',
    yellow: 'badge-yellow',
  }
  
  return (
    <span
      className={`badge ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}