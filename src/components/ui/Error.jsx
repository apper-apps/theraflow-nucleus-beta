import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Une erreur s'est produite",
  message = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
  showRetry = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-sage-900">
              {title}
            </h3>
            <p className="text-sage-600 max-w-md">
              {message}
            </p>
          </div>
          
          {showRetry && onRetry && (
            <Button
              variant="primary"
              icon="RefreshCw"
              onClick={onRetry}
              className="mt-4"
            >
              Réessayer
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default Error