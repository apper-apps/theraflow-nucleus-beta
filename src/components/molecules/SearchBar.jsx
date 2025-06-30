import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  placeholder = "Rechercher...",
  onSearch,
  onClear,
  className = '',
  showClearButton = true
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear?.()
    onSearch?.('')
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>
      
      {showClearButton && searchTerm && (
        <Button
          variant="ghost"
          size="md"
          icon="X"
          onClick={handleClear}
          className="shrink-0"
        />
      )}
    </div>
  )
}

export default SearchBar