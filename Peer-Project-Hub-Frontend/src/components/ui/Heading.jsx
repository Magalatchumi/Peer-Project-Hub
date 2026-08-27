export default function Heading({ 
  children, 
  size = 'md',
  className = '',
  ...props 
}) {
  const sizes = {
    xs: 'text-heading-sm',
    sm: 'text-heading-md',
    md: 'text-heading-lg',
    lg: 'text-heading-xl',
    xl: 'text-display-md',
  }
  
  return (
    <h2
      className={`${sizes[size]} font-bold text-black ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
}