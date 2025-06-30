import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Landing = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSeePricing = () => {
    // Navigate to pricing section or external pricing page
    window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })
  }

const benefits = [
    {
      icon: 'Clock',
      title: t('landing.benefits.items.timeSaving.title'),
      description: t('landing.benefits.items.timeSaving.description')
    },
    {
      icon: 'Users',
      title: t('landing.benefits.items.patientCare.title'),
      description: t('landing.benefits.items.patientCare.description')
    },
    {
      icon: 'BarChart3',
      title: t('landing.benefits.items.growth.title'),
      description: t('landing.benefits.items.growth.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative px-6 py-16 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pr-8"
            >
<div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  <ApperIcon name="Sparkles" size={14} className="mr-2" />
                  {t('landing.hero.badge')}
                </span>
              </div>
              
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {t('landing.hero.title')}
                <span className="text-primary block">{t('landing.hero.titleHighlight')}</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  variant="primary" 
                  size="xl"
                  icon="DollarSign"
                  onClick={handleSeePricing}
                  className="shadow-xl hover:shadow-2xl"
>
                  {t('landing.hero.ctaPrimary')}
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  icon="Play"
                  onClick={() => navigate('/dashboard')}
                >
                  {t('landing.hero.ctaSecondary')}
                </Button>
              </div>

              {/* Trust Indicators */}
<div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Shield" size={16} className="text-green-600" />
                  {t('landing.hero.trustIndicators.hipaa')}
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Star" size={16} className="text-yellow-500" />
                  {t('landing.hero.trustIndicators.rating')}
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Users" size={16} className="text-blue-600" />
                  {t('landing.hero.trustIndicators.users')}
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                <Card variant="elevated" className="p-0 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-sage-100 flex items-center justify-center">
                    <div className="text-center p-8">
<ApperIcon name="Activity" size={80} className="text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('landing.hero.dashboardPreview')}</h3>
                      <p className="text-gray-600">{t('landing.hero.dashboardSubtitle')}</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 z-20"
              >
                <Card variant="elevated" className="p-4 bg-white shadow-xl">
<div className="flex items-center gap-3">
                    <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                    <span className="text-sm font-medium">{t('landing.hero.sessionComplete')}</span>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 z-20"
              >
                <Card variant="elevated" className="p-4 bg-white shadow-xl">
<div className="flex items-center gap-3">
                    <ApperIcon name="Clock" size={20} className="text-blue-600" />
                    <span className="text-sm font-medium">{t('landing.hero.timeSaved')}</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="px-6 py-16 bg-white/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl">
<div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name={benefit.icon} size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="px-6 py-16 bg-gradient-to-r from-primary to-primary/90"
      >
        <div className="mx-auto max-w-4xl text-center">
<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
<div>
                <div className="text-3xl font-bold">{t('landing.cta.pricing.price')}</div>
                <div className="text-primary-100">{t('landing.cta.pricing.period')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{t('landing.cta.pricing.trial')}</div>
                <div className="text-primary-100">{t('landing.cta.pricing.trialText')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{t('landing.cta.pricing.support')}</div>
                <div className="text-primary-100">{t('landing.cta.pricing.supportText')}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl"
              icon="ArrowRight"
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
>
              {t('landing.cta.buttons.startTrial')}
            </Button>
<Button 
              variant="outline" 
              size="xl"
              icon="Phone"
              className="border-gray-300 text-gray-700 bg-white/90 hover:bg-white hover:text-gray-900"
            >
              {t('landing.cta.buttons.scheduleDemo')}
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Landing