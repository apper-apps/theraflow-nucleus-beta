import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Aucun élément trouvé",
  message = "Il n'y a rien à afficher pour le moment.",
  icon = "Inbox",
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="text-center py-16">
        <div className="flex flex-col items-center space-y-6">
          <motion.div 
            className="p-6 bg-sage-100 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ApperIcon name={icon} size={48} className="text-sage-400" />
          </motion.div>
          
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-sage-900">
              {title}
            </h3>
            <p className="text-sage-600 leading-relaxed">
              {message}
            </p>
          </div>
          
          {actionLabel && onAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onAction}
                className="mt-4"
              >
                {actionLabel}
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty