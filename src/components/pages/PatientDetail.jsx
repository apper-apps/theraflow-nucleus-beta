import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { patientService } from '@/services/api/patientService'
import { appointmentService } from '@/services/api/appointmentService'
import { sessionNoteService } from '@/services/api/sessionNoteService'
import { toast } from 'react-toastify'

const PatientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [sessionNotes, setSessionNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const loadPatientData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const patientId = parseInt(id)
      const [patientData, appointmentsData, notesData] = await Promise.all([
        patientService.getById(patientId),
        appointmentService.getAll(),
        sessionNoteService.getAll()
      ])
      
      if (!patientData) {
        setError('Patient non trouvé')
        return
      }
      
      setPatient(patientData)
      setAppointments(appointmentsData.filter(apt => apt.patientId === patientId))
      setSessionNotes(notesData.filter(note => note.patientId === patientId))
    } catch (err) {
      setError('Impossible de charger les données du patient')
      console.error('Patient detail loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatientData()
  }, [id])

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

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }
  
  const getAppointmentStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Programmé'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
  const totalRevenue = completedAppointments * 60 // Assuming 60€ per session

  if (loading) return <Loading type="default" />
  if (error) return <Error message={error} onRetry={loadPatientData} />
  if (!patient) return <Error message="Patient non trouvé" showRetry={false} />

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'User' },
    { id: 'appointments', label: 'Rendez-vous', icon: 'Calendar' },
    { id: 'notes', label: 'Notes de séance', icon: 'FileText' },
    { id: 'billing', label: 'Facturation', icon: 'CreditCard' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/patients')}
          >
            Retour
          </Button>
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-sage-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <Badge variant={getStatusColor(patient.status)}>
                {getStatusText(patient.status)}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-sage-600">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Mail" size={14} />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Phone" size={14} />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={14} />
                <span>Patient depuis le {format(new Date(patient.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="md"
            icon="Edit"
            onClick={() => toast.info('Fonctionnalité de modification à implémenter')}
          >
            Modifier
          </Button>
          
          <Button
            variant="primary"
            size="md"
            icon="CalendarPlus"
            onClick={() => toast.info('Fonctionnalité de programmation RDV à implémenter')}
          >
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <ApperIcon name="Calendar" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">{appointments.length}</p>
              <p className="text-sm text-sage-600">Rendez-vous total</p>
            </div>
          </div>
        </Card>
        
        <Card padding="lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">{completedAppointments}</p>
              <p className="text-sm text-sage-600">Séances terminées</p>
            </div>
          </div>
        </Card>
        
        <Card padding="lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary/20 rounded-full">
              <ApperIcon name="Euro" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">{totalRevenue}€</p>
              <p className="text-sm text-sage-600">Revenus générés</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-sage-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-sage-500 hover:text-sage-700 hover:border-sage-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Informations personnelles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-sage-600">Date de naissance</label>
                  <p className="text-sage-900">{format(new Date(patient.dateOfBirth), 'dd MMMM yyyy', { locale: fr })}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-sage-600">Adresse</label>
                  <p className="text-sage-900">{patient.address}</p>
                </div>
                
                {patient.allergies && (
                  <div>
                    <label className="text-sm font-medium text-sage-600">Allergies</label>
                    <p className="text-sage-900">{patient.allergies}</p>
                  </div>
                )}
              </div>
            </Card>
            
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Historique médical</h3>
              
              <div className="space-y-4">
                {patient.medicalHistory ? (
                  <p className="text-sage-700 leading-relaxed">{patient.medicalHistory}</p>
                ) : (
                  <p className="text-sage-500 italic">Aucun historique médical renseigné</p>
                )}
              </div>
            </Card>
            
            <Card padding="lg" className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Notes</h3>
              
              {patient.notes ? (
                <p className="text-sage-700 leading-relaxed">{patient.notes}</p>
              ) : (
                <p className="text-sage-500 italic">Aucune note disponible</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <ApperIcon name="Calendar" size={48} className="text-sage-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-sage-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-sage-600 mb-4">Ce patient n'a pas encore de rendez-vous programmé.</p>
                <Button variant="primary" icon="CalendarPlus">
                  Programmer un RDV
                </Button>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.Id} padding="lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-sage-900">
                          {format(new Date(appointment.date), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}
                        </h4>
                        <Badge variant={getAppointmentStatusColor(appointment.status)}>
                          {getAppointmentStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-sage-600 mb-2">
                        <span>Durée: {appointment.duration} min</span>
                        {appointment.type && <span>Type: {appointment.type}</span>}
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sage-700 text-sm">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {sessionNotes.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <ApperIcon name="FileText" size={48} className="text-sage-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-sage-900 mb-2">Aucune note de séance</h3>
                <p className="text-sage-600 mb-4">Aucune note n'a été prise pour ce patient.</p>
                <Button variant="primary" icon="Plus">
                  Ajouter une note
                </Button>
              </Card>
            ) : (
              sessionNotes.map((note) => (
                <Card key={note.Id} padding="lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-sage-900">
                      Séance du {format(new Date(note.date), 'dd MMMM yyyy', { locale: fr })}
                    </h4>
                    <Button variant="ghost" size="sm" icon="Edit">
                      Modifier
                    </Button>
                  </div>
                  
                  <div className="prose prose-sage max-w-none">
                    <p className="text-sage-700 leading-relaxed">{note.content}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <Card padding="lg" className="text-center py-12">
            <ApperIcon name="CreditCard" size={48} className="text-sage-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sage-900 mb-2">Fonctionnalité de facturation</h3>
            <p className="text-sage-600">Cette section sera bientôt disponible pour gérer les paiements et factures.</p>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default PatientDetail