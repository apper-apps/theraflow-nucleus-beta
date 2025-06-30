import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  padding = 'default',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'card-soft',
    gentle: 'card-gentle',
    flat: 'bg-white border border-sage-100/50 rounded-lg',
    elevated: 'bg-white shadow-lift border border-sage-100/50 rounded-lg'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }

  const CardComponent = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 8px 25px rgba(124, 152, 133, 0.2)' },
    transition: { duration: 0.2, ease: 'easeOut' }
  } : {}

  return (
    <CardComponent
      className={`${variants[variant]} ${paddings[padding]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card