import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, startOfDay, endOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import StatCard from '@/components/molecules/StatCard'
import AppointmentCard from '@/components/molecules/AppointmentCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { appointmentService } from '@/services/api/appointmentService'
import { patientService } from '@/services/api/patientService'

const Dashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      setError('Impossible de charger les données du tableau de bord')
      console.error('Dashboard loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate stats
  const todaysAppointments = appointments.filter(apt => 
    isToday(new Date(apt.date)) && apt.status === 'scheduled'
  )
  
  const completedToday = appointments.filter(apt => 
    isToday(new Date(apt.date)) && apt.status === 'completed'
  ).length
  
  const activePatients = patients.filter(p => p.status === 'active').length
  
  const weekRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.payment?.amount || 60), 0) // Default session price

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) return <Loading type="stats" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-sage-900 mb-2">
            Bonjour ! 🌱
          </h1>
          <p className="text-sage-600">
            {format(new Date(), "EEEE dd MMMM yyyy", { locale: fr })}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="RDV aujourd'hui"
          value={todaysAppointments.length}
          icon="Calendar"
          change={completedToday > 0 ? `${completedToday} terminés` : undefined}
          changeType="positive"
        />
        
        <StatCard
          title="Patients actifs"
          value={activePatients}
          icon="Users"
          change="+3 ce mois"
          changeType="positive"
          trend="up"
        />
        
        <StatCard
          title="Revenus semaine"
          value={`${weekRevenue}€`}
          icon="Euro"
          change="+12%"
          changeType="positive"
          trend="up"
        />
        
        <StatCard
          title="Taux de présence"
          value="94%"
          icon="TrendingUp"
          change="+2%"
          changeType="positive"
          trend="up"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ApperIcon name="Calendar" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-sage-900">
                    Rendez-vous d'aujourd'hui
                  </h2>
                  <p className="text-sm text-sage-600">
                    {todaysAppointments.length} rendez-vous programmés
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
              >
                Nouveau RDV
              </Button>
            </div>
            
            <div className="space-y-4">
              {todaysAppointments.length === 0 ? (
                <Empty
                  title="Aucun rendez-vous aujourd'hui"
                  message="Profitez de cette journée calme pour rattraper vos notes ou contacter vos patients."
                  icon="Calendar"
                />
              ) : (
                todaysAppointments.map((appointment) => {
                  const patient = patients.find(p => p.Id === appointment.patientId)
                  return (
                    <AppointmentCard
                      key={appointment.Id}
                      appointment={appointment}
                      patient={patient}
                    />
                  )
                })
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions & Recent Activity */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-sage-900 mb-4">
              Actions rapides
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                icon="UserPlus"
                className="w-full justify-start"
              >
                Nouveau patient
              </Button>
              
              <Button
                variant="outline"
                size="md"
                icon="CalendarPlus"
                className="w-full justify-start"
              >
                Programmer RDV
              </Button>
              
              <Button
                variant="outline"
                size="md"
                icon="FileText"
                className="w-full justify-start"
              >
                Nouvelle note
              </Button>
              
              <Button
                variant="ghost"
                size="md"
                icon="Mail"
                className="w-full justify-start"
              >
                Envoyer rappel
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-sage-900 mb-4">
              Activité récente
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <ApperIcon name="Check" size={12} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-900">Séance terminée avec Marie Dubois</p>
                  <p className="text-xs text-sage-500">Il y a 2 heures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <ApperIcon name="UserPlus" size={12} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-900">Nouveau patient ajouté</p>
                  <p className="text-xs text-sage-500">Hier à 16:30</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-amber-100 rounded-full">
                  <ApperIcon name="Calendar" size={12} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-sage-900">3 rappels envoyés</p>
                  <p className="text-xs text-sage-500">Hier à 10:00</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard