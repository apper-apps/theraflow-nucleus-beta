import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { sessionNoteService } from '@/services/api/sessionNoteService'
import { patientService } from '@/services/api/patientService'
import { appointmentService } from '@/services/api/appointmentService'
import { toast } from 'react-toastify'

const SessionNotes = () => {
  const [sessionNotes, setSessionNotes] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [notesData, patientsData, appointmentsData] = await Promise.all([
        sessionNoteService.getAll(),
        patientService.getAll(),
        appointmentService.getAll()
      ])
      
      setSessionNotes(notesData)
      setPatients(patientsData)
      setAppointments(appointmentsData)
      setFilteredNotes(notesData)
    } catch (err) {
      setError('Impossible de charger les notes de séance')
      console.error('Session notes loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter notes based on search term and selected patient
  useEffect(() => {
    let filtered = sessionNotes

    // Filter by patient
    if (selectedPatient !== 'all') {
      filtered = filtered.filter(note => note.patientId === parseInt(selectedPatient))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note => {
        const patient = patients.find(p => p.Id === note.patientId)
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : ''
        
        return note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
               patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               note.template?.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredNotes(filtered)
  }, [sessionNotes, patients, searchTerm, selectedPatient])

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'
  }

  const getAppointment = (appointmentId) => {
    return appointments.find(apt => apt.Id === appointmentId)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handlePatientFilter = (patientId) => {
    setSelectedPatient(patientId)
  }

  const handleCreateNote = () => {
    setIsCreating(true)
    setEditingNote({
      Id: null,
      patientId: '',
      appointmentId: '',
      date: new Date().toISOString(),
      content: '',
      template: '',
      attachments: []
    })
  }

  const handleEditNote = (note) => {
    setIsCreating(true)
    setEditingNote({ ...note })
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData.Id) {
        // Update existing note
        const updatedNote = await sessionNoteService.update(noteData.Id, noteData)
        setSessionNotes(prev => prev.map(note => 
          note.Id === noteData.Id ? updatedNote : note
        ))
        toast.success('Note mise à jour avec succès')
      } else {
        // Create new note
        const newNote = await sessionNoteService.create(noteData)
        setSessionNotes(prev => [newNote, ...prev])
        toast.success('Note créée avec succès')
      }
      
      setIsCreating(false)
      setEditingNote(null)
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde de la note')
      console.error('Save note error:', err)
    }
  }

  const handleDeleteNote = async (note) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await sessionNoteService.delete(note.Id)
        setSessionNotes(prev => prev.filter(n => n.Id !== note.Id))
        toast.success('Note supprimée avec succès')
      } catch (err) {
        toast.error('Erreur lors de la suppression de la note')
        console.error('Delete note error:', err)
      }
    }
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

  if (loading) return <Loading type="cards" count={4} />
  if (error) return <Error message={error} onRetry={loadData} />

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
          <h1 className="text-3xl font-bold text-sage-900">Notes de séance</h1>
          <p className="text-sage-600 mt-1">
            {sessionNotes.length} notes enregistrées
          </p>
        </div>
        
        <Button
          variant="primary"
          size="lg"
          icon="Plus"
          onClick={handleCreateNote}
        >
          Nouvelle note
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Rechercher dans les notes..."
            onSearch={handleSearch}
            onClear={() => setSearchTerm('')}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-sage-700 hidden sm:block">Patient:</span>
          
          <select
            value={selectedPatient}
            onChange={(e) => handlePatientFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">Tous les patients</option>
            {patients.map((patient) => (
              <option key={patient.Id} value={patient.Id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Notes List */}
      <motion.div variants={itemVariants}>
        {filteredNotes.length === 0 ? (
          <Empty
            title={searchTerm || selectedPatient !== 'all' ? "Aucune note trouvée" : "Aucune note de séance"}
            message={
              searchTerm || selectedPatient !== 'all'
                ? "Aucune note ne correspond à vos critères de recherche."
                : "Commencez par créer votre première note de séance pour documenter vos consultations."
            }
            icon="FileText"
            actionLabel={!searchTerm && selectedPatient === 'all' ? "Créer une note" : undefined}
            onAction={!searchTerm && selectedPatient === 'all' ? handleCreateNote : undefined}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotes.map((note) => {
                const patient = patients.find(p => p.Id === note.patientId)
                const appointment = getAppointment(note.appointmentId)
                
                return (
                  <motion.div
                    key={note.Id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card hover padding="lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-sage-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}
                            </h3>
                            {note.template && (
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {note.template}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-sage-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>{format(new Date(note.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}</span>
                            </div>
                            
                            {appointment && (
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" size={14} />
                                <span>{appointment.duration} min</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Edit"
                            onClick={() => handleEditNote(note)}
                          >
                            Modifier
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleDeleteNote(note)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="prose prose-sage max-w-none">
                        <p className="text-sage-700 leading-relaxed line-clamp-4">
                          {note.content}
                        </p>
                      </div>
                      
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-sage-100">
                          <div className="flex items-center space-x-2 text-sm text-sage-600">
                            <ApperIcon name="Paperclip" size={14} />
                            <span>{note.attachments.length} pièce(s) jointe(s)</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Note Editor Modal */}
      {isCreating && editingNote && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lift max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="p-6 border-b border-sage-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-sage-900">
                  {editingNote.Id ? 'Modifier la note' : 'Nouvelle note de séance'}
                </h2>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => {
                    setIsCreating(false)
                    setEditingNote(null)
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Patient
                  </label>
                  <select
                    value={editingNote.patientId}
                    onChange={(e) => setEditingNote({
                      ...editingNote,
                      patientId: parseInt(e.target.value)
                    })}
                    className="input-field"
                    required
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map((patient) => (
                      <option key={patient.Id} value={patient.Id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Template
                  </label>
                  <select
                    value={editingNote.template}
                    onChange={(e) => setEditingNote({
                      ...editingNote,
                      template: e.target.value
                    })}
                    className="input-field"
                  >
                    <option value="">Aucun template</option>
                    <option value="Hypnose">Séance d'hypnose</option>
                    <option value="Sophrologie">Séance de sophrologie</option>
                    <option value="Naturopathie">Consultation naturopathie</option>
                    <option value="Suivi">Séance de suivi</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Contenu de la séance
                </label>
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({
                    ...editingNote,
                    content: e.target.value
                  })}
                  rows={12}
                  className="input-field resize-none"
                  placeholder="Décrivez le déroulement de la séance, les observations, les techniques utilisées, les réactions du patient..."
                  required
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-sage-100 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setEditingNote(null)
                }}
              >
                Annuler
              </Button>
              
              <Button
                variant="primary"
                onClick={() => handleSaveNote(editingNote)}
                disabled={!editingNote.patientId || !editingNote.content.trim()}
              >
                {editingNote.Id ? 'Mettre à jour' : 'Créer la note'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SessionNotes