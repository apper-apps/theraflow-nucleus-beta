import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header 
      className="bg-white border-b border-sage-100 px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={isSidebarOpen ? "X" : "Menu"}
            onClick={onToggleSidebar}
            className="lg:hidden"
          />
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ThéraFlow
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 text-sm text-sage-600">
            <ApperIcon name="Clock" size={16} />
            <span>
              {currentTime.toLocaleDateString('fr-FR', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header