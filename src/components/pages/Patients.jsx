import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PatientCard from '@/components/molecules/PatientCard'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { patientService } from '@/services/api/patientService'
import { toast } from 'react-toastify'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await patientService.getAll()
      setPatients(data)
      setFilteredPatients(data)
    } catch (err) {
      setError('Impossible de charger la liste des patients')
      console.error('Patients loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  // Filter patients based on search term and status
  useEffect(() => {
    let filtered = patients

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter)
    }

    setFilteredPatients(filtered)
  }, [patients, searchTerm, statusFilter])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
  }

  const handleEditPatient = (patient) => {
    toast.info(`Modification de ${patient.firstName} ${patient.lastName} (fonctionnalité à implémenter)`)
  }

  const handleDeletePatient = async (patient) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${patient.firstName} ${patient.lastName} ?`)) {
      try {
        await patientService.delete(patient.Id)
        setPatients(prev => prev.filter(p => p.Id !== patient.Id))
        toast.success('Patient supprimé avec succès')
      } catch (err) {
        toast.error('Erreur lors de la suppression du patient')
        console.error('Delete patient error:', err)
      }
    }
  }

  const getStatusCount = (status) => {
    return patients.filter(p => status === 'all' ? true : p.status === status).length
  }

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

  if (loading) return <Loading type="cards" count={6} />
  if (error) return <Error message={error} onRetry={loadPatients} />

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Patients</h1>
          <p className="text-sage-600 mt-1">
            Gérez vos {patients.length} patients
          </p>
        </div>
        
        <Button
          variant="primary"
          size="lg"
          icon="UserPlus"
          onClick={() => toast.info('Fonctionnalité d\'ajout de patient à implémenter')}
        >
          Nouveau patient
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Rechercher par nom, email ou téléphone..."
            onSearch={handleSearch}
            onClear={() => setSearchTerm('')}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-sage-700 hidden sm:block">Statut:</span>
          
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              Tous ({getStatusCount('all')})
            </Button>
            
            <Button
              variant={statusFilter === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('active')}
            >
              Actifs ({getStatusCount('active')})
            </Button>
            
            <Button
              variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('inactive')}
            >
              Inactifs ({getStatusCount('inactive')})
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results Info */}
      {(searchTerm || statusFilter !== 'all') && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center space-x-2 text-sm text-sage-600">
            <span>{filteredPatients.length} résultat(s)</span>
            {searchTerm && (
              <Badge variant="primary">
                "{searchTerm}"
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="info">
                {statusFilter === 'active' ? 'Actifs' : 'Inactifs'}
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Patient Cards */}
      <motion.div variants={itemVariants}>
        {filteredPatients.length === 0 ? (
          <Empty
            title={searchTerm ? "Aucun patient trouvé" : "Aucun patient"}
            message={
              searchTerm 
                ? "Aucun patient ne correspond à votre recherche. Essayez avec d'autres termes."
                : "Commencez par ajouter votre premier patient pour gérer votre pratique thérapeutique."
            }
            icon="Users"
            actionLabel={!searchTerm ? "Ajouter un patient" : undefined}
            onAction={!searchTerm ? () => toast.info('Fonctionnalité d\'ajout de patient à implémenter') : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.Id}
                  patient={patient}
                  onEdit={handleEditPatient}
                  onDelete={handleDeletePatient}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Patients