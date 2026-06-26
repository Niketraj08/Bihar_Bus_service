import { createContext, useContext, useState, useCallback } from 'react'
import NotificationContainer from '../components/Notification'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      type,
      title,
      message,
      duration
    }

    setNotifications(prev => [...prev, notification])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // Convenience methods for different notification types
  const success = useCallback((title, message, duration) => {
    return addNotification('success', title, message, duration)
  }, [addNotification])

  const error = useCallback((title, message, duration) => {
    return addNotification('error', title, message, duration)
  }, [addNotification])

  const warning = useCallback((title, message, duration) => {
    return addNotification('warning', title, message, duration)
  }, [addNotification])

  const info = useCallback((title, message, duration) => {
    return addNotification('info', title, message, duration)
  }, [addNotification])

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  )
}

export default NotificationContext
