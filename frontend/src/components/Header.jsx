import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings } from 'lucide-react'

export default function Header({ title = "Bihar Bus Service" }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500'
      case 'driver': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Admin'
      case 'driver': return 'Driver'
      default: return 'User'
    }
  }

  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/Screenshot 2026-01-17 111835.png"
              alt="Bihar Bus Service Logo"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${getRoleColor(user.role)}`}></span>
                    <span className="text-xs text-primary-100">{getRoleText(user.role)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Settings Button - Available for all users */}
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Admin Panel"
                  >
                    <Settings size={18} />
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

