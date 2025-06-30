import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const navigationItems = [
    { path: '/', label: 'Tableau de bord', icon: 'LayoutDashboard' },
    { path: '/patients', label: 'Patients', icon: 'Users' },
    { path: '/agenda', label: 'Agenda', icon: 'Calendar' },
    { path: '/notes', label: 'Notes de séance', icon: 'FileText' },
    { path: '/settings', label: 'Paramètres', icon: 'Settings' }
  ]

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-72 bg-white border-r border-sage-100 z-50 lg:relative lg:translate-x-0"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <div className="p-6 border-b border-sage-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ThéraFlow
              </h2>
              <p className="text-sm text-sage-600">CRM pour thérapeutes</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        
        <div className="absolute bottom-6 left-4 right-4">
          <div className="p-4 bg-gradient-to-br from-sage-50 to-secondary rounded-lg border border-sage-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <ApperIcon name="Sparkles" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-sage-900">Version Pro</p>
                <p className="text-xs text-sage-600">Patients illimités</p>
              </div>
            </div>
            <div className="w-full bg-sage-200 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-xs text-sage-600">37/50 patients utilisés</p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar