import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    // Profile settings
    practitionerName: 'Dr. Marie Dubois',
    email: 'marie.dubois@theraflow.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris',
    speciality: 'Hypnothérapie & Sophrologie',
    
    // Business settings
    sessionDuration: 60,
    sessionPrice: 60,
    currency: 'EUR',
    timeZone: 'Europe/Paris',
    
    // Notification settings
    emailReminders: true,
    smsReminders: false,
    reminderTime: 24,
    emailReports: true,
    
    // Appointment settings
    bookingWindow: 30,
    cancelPolicy: 24,
    autoConfirm: true,
    allowOnlineBooking: false
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success('Paramètres sauvegardés avec succès')
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: 'User' },
    { id: 'business', label: 'Activité', icon: 'Briefcase' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'appointments', label: 'Rendez-vous', icon: 'Calendar' },
    { id: 'billing', label: 'Facturation', icon: 'CreditCard' }
  ]

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-sage-900">Paramètres</h1>
        <p className="text-sage-600 mt-1">
          Configurez votre espace de travail thérapeutique
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-sage-600 hover:bg-sage-50 hover:text-sage-900'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card padding="lg">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900 mb-4">Informations personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom complet"
                      value={settings.practitionerName}
                      onChange={(e) => handleSettingChange('practitionerName', e.target.value)}
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                    />
                    
                    <Input
                      label="Téléphone"
                      value={settings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                    />
                    
                    <Input
                      label="Spécialité"
                      value={settings.speciality}
                      onChange={(e) => handleSettingChange('speciality', e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Adresse du cabinet"
                      value={settings.address}
                      onChange={(e) => handleSettingChange('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900 mb-4">Paramètres d'activité</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Durée de séance par défaut (minutes)
                      </label>
                      <select
                        value={settings.sessionDuration}
                        onChange={(e) => handleSettingChange('sessionDuration', parseInt(e.target.value))}
                        className="input-field"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                        <option value={90}>90 minutes</option>
                        <option value={120}>2 heures</option>
                      </select>
                    </div>
                    
                    <Input
                      label="Tarif par séance (€)"
                      type="number"
                      value={settings.sessionPrice}
                      onChange={(e) => handleSettingChange('sessionPrice', parseInt(e.target.value))}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        value={settings.timeZone}
                        onChange={(e) => handleSettingChange('timeZone', e.target.value)}
                        className="input-field"
                      >
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Europe/Berlin">Europe/Berlin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Devise
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                        className="input-field"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre Sterling (£)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900 mb-4">Paramètres de notification</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-sage-900">Rappels par email</h3>
                        <p className="text-sm text-sage-600">Envoyer des rappels automatiques par email</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('emailReminders', !settings.emailReminders)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailReminders ? 'bg-primary' : 'bg-sage-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-sage-900">Rappels par SMS</h3>
                        <p className="text-sm text-sage-600">Envoyer des rappels automatiques par SMS</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('smsReminders', !settings.smsReminders)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.smsReminders ? 'bg-primary' : 'bg-sage-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.smsReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Délai de rappel (heures avant RDV)
                      </label>
                      <select
                        value={settings.reminderTime}
                        onChange={(e) => handleSettingChange('reminderTime', parseInt(e.target.value))}
                        className="input-field w-full md:w-48"
                      >
                        <option value={1}>1 heure</option>
                        <option value={2}>2 heures</option>
                        <option value={6}>6 heures</option>
                        <option value={24}>24 heures</option>
                        <option value={48}>48 heures</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900 mb-4">Gestion des rendez-vous</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Fenêtre de réservation (jours)
                      </label>
                      <select
                        value={settings.bookingWindow}
                        onChange={(e) => handleSettingChange('bookingWindow', parseInt(e.target.value))}
                        className="input-field"
                      >
                        <option value={7}>7 jours</option>
                        <option value={14}>14 jours</option>
                        <option value={30}>30 jours</option>
                        <option value={60}>60 jours</option>
                        <option value={90}>90 jours</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Politique d'annulation (heures)
                      </label>
                      <select
                        value={settings.cancelPolicy}
                        onChange={(e) => handleSettingChange('cancelPolicy', parseInt(e.target.value))}
                        className="input-field"
                      >
                        <option value={12}>12 heures</option>
                        <option value={24}>24 heures</option>
                        <option value={48}>48 heures</option>
                        <option value={72}>72 heures</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-sage-900">Confirmation automatique</h3>
                        <p className="text-sm text-sage-600">Confirmer automatiquement les nouveaux RDV</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('autoConfirm', !settings.autoConfirm)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoConfirm ? 'bg-primary' : 'bg-sage-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoConfirm ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-sage-900">Réservation en ligne</h3>
                        <p className="text-sm text-sage-600">Permettre aux patients de réserver en ligne</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('allowOnlineBooking', !settings.allowOnlineBooking)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.allowOnlineBooking ? 'bg-primary' : 'bg-sage-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.allowOnlineBooking ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-sage-900 mb-4">Facturation et paiements</h2>
                  
                  <div className="text-center py-12">
                    <ApperIcon name="CreditCard" size={48} className="text-sage-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">Fonctionnalité en développement</h3>
                    <p className="text-sage-600 mb-4">
                      La gestion des paiements et la facturation seront bientôt disponibles.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-sage-600">• Paiement en ligne sécurisé</p>
                      <p className="text-sm text-sage-600">• Génération automatique de factures</p>
                      <p className="text-sm text-sage-600">• Suivi des encaissements</p>
                      <p className="text-sm text-sage-600">• Abonnements et forfaits</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-sage-100">
              <Button
                variant="primary"
                size="lg"
                icon="Save"
                onClick={handleSaveSettings}
              >
                Sauvegarder les paramètres
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Settings