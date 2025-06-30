import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/20 hover:shadow-gentle',
    secondary: 'bg-secondary hover:bg-sage-200 text-sage-700 focus:ring-sage-200',
    outline: 'border border-sage-300 bg-white hover:bg-sage-50 text-sage-700 focus:ring-sage-200 active:bg-sage-700 active:text-white',
    ghost: 'text-sage-600 hover:bg-sage-100 hover:text-sage-800 focus:ring-sage-200',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-200'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-2" 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button