import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const NotificationItem = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true)

    // Auto-close after duration
    const timer = setTimeout(() => {
      handleClose()
    }, notification.duration || 5000)

    return () => clearTimeout(timer)
  }, [notification.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(notification.id)
    }, 300) // Match animation duration
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />
      case 'error':
        return <XCircle size={20} className="text-red-500" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-80 max-w-md transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            {notification.message && (
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

export default NotificationContainer
