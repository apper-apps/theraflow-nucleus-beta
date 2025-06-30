import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'

const Loading = ({ type = 'default', count = 3 }) => {
  const variants = {
    default: () => (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    ),
    
    cards: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-5 bg-sage-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-sage-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-sage-200 rounded w-2/3"></div>
              </div>
              <div className="w-16 h-6 bg-sage-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-sage-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-sage-200 rounded w-4/5 mb-4"></div>
            <div className="flex justify-between items-center pt-4 border-t border-sage-100">
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-sage-200 rounded"></div>
                <div className="w-24 h-8 bg-sage-200 rounded"></div>
              </div>
              <div className="w-16 h-8 bg-sage-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    ),
    
    list: () => (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-sage-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-sage-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-sage-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    ),
    
    stats: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-sage-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-sage-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-sage-200 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-sage-200 rounded-full"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return variants[type]()
}

export default Loading