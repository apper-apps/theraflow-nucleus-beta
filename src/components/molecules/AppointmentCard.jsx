import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AppointmentCard = ({ appointment, patient, onEdit, onCancel, onComplete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Programmé'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="border-l-4 border-l-primary">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-sage-900">
                {patient?.firstName} {patient?.lastName}
              </h3>
              <Badge variant={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-sage-600 mb-2">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" size={14} />
                <span>{format(new Date(appointment.date), 'HH:mm')}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="Timer" size={14} />
                <span>{appointment.duration} min</span>
              </div>
            </div>
            
            {appointment.type && (
              <div className="flex items-center space-x-1 text-sm text-sage-600 mb-2">
                <ApperIcon name="Activity" size={14} />
                <span>{appointment.type}</span>
              </div>
            )}
            
            {appointment.notes && (
              <p className="text-sm text-sage-600 mt-2 line-clamp-2">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-sage-100">
          <div className="flex space-x-2">
            {appointment.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Edit"
                  onClick={() => onEdit?.(appointment)}
                >
                  Modifier
                </Button>
                
                <Button
                  variant="success"
                  size="sm"
                  icon="Check"
                  onClick={() => onComplete?.(appointment)}
                >
                  Terminer
                </Button>
              </>
            )}
            
            {appointment.status !== 'cancelled' && (
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => onCancel?.(appointment)}
                className="text-red-600 hover:bg-red-50"
              >
                Annuler
              </Button>
            )}
          </div>
          
          <div className="text-xs text-sage-500">
            {format(new Date(appointment.date), 'EEEE dd MMMM', { locale: fr })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AppointmentCard