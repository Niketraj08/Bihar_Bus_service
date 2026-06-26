import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, MapPin, Ticket, User, LogOut, Settings } from 'lucide-react'

export default function BottomNavigation() {
  const location = useLocation()
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
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const navItems = user ? [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tracking', icon: MapPin, label: 'Explore' },
    { path: '/dashboard', icon: Ticket, label: 'Tickets' },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings'
    },
  ] : [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tracking', icon: MapPin, label: 'Explore' },
    { path: '/login', icon: User, label: 'Login' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={item.onClick || (() => navigate(item.path))}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}

        {/* Logout button for authenticated users */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors text-red-500 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={24} />
            <span className="text-xs mt-1 font-medium">Logout</span>
          </button>
        )}
      </div>
    </nav>
  )
}

