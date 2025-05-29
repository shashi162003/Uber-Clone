import React from 'react'

const Spinner = ({ size = 'medium', color = 'white' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'large':
        return 'w-8 h-8'
      default:
        return 'w-6 h-6'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'black':
        return 'border-gray-800 border-t-transparent'
      case 'blue':
        return 'border-blue-500 border-t-transparent'
      default:
        return 'border-white border-t-transparent'
    }
  }

  return (
    <div className={`${getSizeClasses()} border-2 ${getColorClasses()} rounded-full animate-spin`}></div>
  )
}

export default Spinner
