import { useState } from 'react'

const useToast = () => {
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showToast = (message, type = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    })
  }

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  return {
    toast,
    showToast,
    hideToast
  }
}

export default useToast
