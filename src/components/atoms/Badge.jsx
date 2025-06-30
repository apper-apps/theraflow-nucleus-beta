import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-sage-100 text-sage-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary/10 text-primary'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  )
}

export default Badge