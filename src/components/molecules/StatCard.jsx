import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  trend,
  loading = false,
  className = ''
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-sage-600'
  }

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-sage-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-sage-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-sage-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-sage-200 rounded-full"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card hover className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-sage-600 mb-1">{title}</p>
          
          <motion.p 
            className="text-3xl font-bold text-sage-900 mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.p>
          
          {change && (
            <div className="flex items-center space-x-1">
              {trend && (
                <ApperIcon 
                  name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  className={changeColors[changeType]} 
                />
              )}
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-primary/10 rounded-full">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard