import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { appointmentService } from '@/services/api/appointmentService'
import { patientService } from '@/services/api/patientService'
import { toast } from 'react-toastify'

const Agenda = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'day', 'week', 'month'

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll()
      ])
      
      setAppointments(appointmentsData)
      setPatients(patientsData)
    } catch (err) {
      setError('Impossible de charger l\'agenda')
      console.error('Agenda loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'
  }

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

  const getWeekDays = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
  }

  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const handleCompleteAppointment = async (appointment) => {
    try {
      const updatedAppointment = { ...appointment, status: 'completed' }
      await appointmentService.update(appointment.Id, updatedAppointment)
      setAppointments(prev => prev.map(apt => 
        apt.Id === appointment.Id ? updatedAppointment : apt
      ))
      toast.success('Rendez-vous marqué comme terminé')
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du rendez-vous')
      console.error('Complete appointment error:', err)
    }
  }

  const handleCancelAppointment = async (appointment) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      try {
        const updatedAppointment = { ...appointment, status: 'cancelled' }
        await appointmentService.update(appointment.Id, updatedAppointment)
        setAppointments(prev => prev.map(apt => 
          apt.Id === appointment.Id ? updatedAppointment : apt
        ))
        toast.success('Rendez-vous annulé')
      } catch (err) {
        toast.error('Erreur lors de l\'annulation du rendez-vous')
        console.error('Cancel appointment error:', err)
      }
    }
  }

  const nextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7))
  }

  const prevWeek = () => {
    setCurrentDate(prev => addDays(prev, -7))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  if (loading) return <Loading type="default" />
  if (error) return <Error message={error} onRetry={loadData} />

  const weekDays = getWeekDays()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Agenda</h1>
          <p className="text-sage-600 mt-1">
            Semaine du {format(weekDays[0], 'dd MMMM', { locale: fr })} au {format(weekDays[6], 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon="ChevronLeft"
            onClick={prevWeek}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="px-4"
          >
            Aujourd'hui
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="ChevronRight"
            onClick={nextWeek}
          />
          
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
            onClick={() => toast.info('Fonctionnalité d\'ajout de RDV à implémenter')}
          >
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day)
          const isCurrentDay = isToday(day)
          
          return (
            <Card 
              key={day.toISOString()} 
              padding="sm" 
              className={`min-h-[400px] ${isCurrentDay ? 'ring-2 ring-primary/20 border-primary/30' : ''}`}
            >
              {/* Day Header */}
              <div className={`text-center pb-3 mb-4 border-b border-sage-100 ${isCurrentDay ? 'bg-primary/5 -m-4 p-4 mb-4 rounded-t-lg' : ''}`}>
                <div className="text-sm font-medium text-sage-600 uppercase tracking-wide">
                  {format(day, 'EEEE', { locale: fr })}
                </div>
                <div className={`text-2xl font-bold ${isCurrentDay ? 'text-primary' : 'text-sage-900'}`}>
                  {format(day, 'd')}
                </div>
              </div>
              
              {/* Appointments */}
              <div className="space-y-2">
                {dayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-sage-400">
                    <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun RDV</p>
                  </div>
                ) : (
                  dayAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.Id}
                      layout
                      className="p-3 bg-sage-50 rounded-lg border border-sage-100 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-medium text-sage-900">
                          {format(new Date(appointment.date), 'HH:mm')}
                        </div>
                        <Badge variant={getStatusColor(appointment.status)} size="sm">
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-sage-700 mb-1">
                        {getPatientName(appointment.patientId)}
                      </div>
                      
                      <div className="text-xs text-sage-500 mb-3">
                        {appointment.duration} min • {appointment.type || 'Consultation'}
                      </div>
                      
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-1">
                          <Button
                            variant="success"
                            size="sm"
                            icon="Check"
                            onClick={() => handleCompleteAppointment(appointment)}
                            className="text-xs px-2 py-1"
                          >
                            Terminer
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="X"
                            onClick={() => handleCancelAppointment(appointment)}
                            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Weekly Summary */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-sage-900 mb-4">Résumé de la semaine</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-sage-900">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date)
                return weekDays.some(day => isSameDay(aptDate, day)) && apt.status === 'scheduled'
              }).length}
            </div>
            <p className="text-sm text-sage-600">RDV programmés</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date)
                return weekDays.some(day => isSameDay(aptDate, day)) && apt.status === 'completed'
              }).length}
            </div>
            <p className="text-sm text-sage-600">RDV terminés</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date)
                return weekDays.some(day => isSameDay(aptDate, day)) && apt.status === 'cancelled'
              }).length}
            </div>
            <p className="text-sm text-sage-600">RDV annulés</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date)
                return weekDays.some(day => isSameDay(aptDate, day)) && apt.status === 'completed'
              }).length * 60}€
            </div>
            <p className="text-sm text-sage-600">Revenus estimés</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Agenda