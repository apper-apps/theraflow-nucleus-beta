import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const navigate = useNavigate()
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'archived': return 'error'
      default: return 'default'
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'inactive': return 'Inactif'
      case 'archived': return 'Archivé'
      default: return status
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => navigate(`/patients/${patient.Id}`)}
          >
            <h3 className="text-lg font-semibold text-sage-900 mb-1">
              {patient.firstName} {patient.lastName}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm text-sage-600 mb-2">
              <ApperIcon name="Mail" size={14} />
              <span>{patient.email}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-sage-600 mb-3">
              <ApperIcon name="Phone" size={14} />
              <span>{patient.phone}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-sage-600">
              <ApperIcon name="Calendar" size={14} />
              <span>Créé le {format(new Date(patient.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
          </div>
          
          <Badge variant={getStatusColor(patient.status)}>
            {getStatusText(patient.status)}
          </Badge>
        </div>
        
        {patient.notes && (
          <p className="text-sm text-sage-600 mb-4 line-clamp-2">
            {patient.notes}
          </p>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t border-sage-100">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon="Edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(patient)
              }}
            >
              Modifier
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(patient)
              }}
              className="text-red-600 hover:bg-red-50"
            >
              Supprimer
            </Button>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            icon="Eye"
            onClick={() => navigate(`/patients/${patient.Id}`)}
          >
            Voir détails
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default PatientCard