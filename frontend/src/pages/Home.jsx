import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Clock, Navigation, Map, Calendar, User, LogIn } from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: ''
  })

  const cities = ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga']

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

  const handleSearch = () => {
    if (searchData.source && searchData.destination && searchData.date) {
      navigate('/buses', { state: searchData })
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-600'
      case 'driver': return 'text-blue-600'
      default: return 'text-green-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section for Authenticated Users */}
        {user && (
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-primary-100">
                  {user.role === 'admin' ? 'Ready to manage your bus service?' : 'Ready for your next journey?'}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)} bg-white bg-opacity-20`}>
                  <User size={16} />
                  <span className="capitalize">{user.role}</span>
                </div>
                {user.role !== 'admin' && (
                  <div className="mt-2 text-sm text-primary-100">
                    Wallet: ₹{user.walletBalance || 0}
                  </div>
                )}
              </div>
            </div>
            {user.role === 'admin' && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Find Your Bus</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-600" size={20} />
                <input
                  type="text"
                  placeholder="Source"
                  value={searchData.source}
                  onChange={(e) => setSearchData({ ...searchData, source: e.target.value })}
                  className="input-field pl-10"
                  list="cities"
                />
                <datalist id="cities">
                  {cities.map(city => <option key={city} value={city} />)}
                </datalist>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-600" size={20} />
                <input
                  type="text"
                  placeholder="Destination"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="input-field pl-10"
                  list="cities"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <button onClick={handleSearch} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Search size={20} />
              <span>Find Buses</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            onClick={() => navigate('/tracking')}
            className="card cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-primary-500 to-primary-600 text-white"
          >
            <Navigation size={32} className="mb-2" />
            <h3 className="font-semibold">Live Tracking</h3>
            <p className="text-sm text-primary-100">Track your bus</p>
          </div>

          <div
            onClick={() => navigate('/monthly-pass')}
            className="card cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-green-500 to-emerald-600 text-white"
          >
            <Calendar size={32} className="mb-2" />
            <h3 className="font-semibold">Monthly Pass</h3>
            <p className="text-sm text-green-100">Save up to 30%</p>
          </div>
        </div>

        <div className="card cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br from-primary-400 to-secondary-500 text-white mb-6">
          <MapPin size={32} className="mb-2" />
          <h3 className="font-semibold">Nearby Stops</h3>
          <p className="text-sm text-white/90">Find stops near you</p>
        </div>

        {/* Bihar Map Preview */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Active Routes</h3>
            <Map className="text-primary-600" size={24} />
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-gray-800 mb-2">Bihar State Map</h4>
              <p className="text-sm text-gray-600 mb-4">View all active bus routes</p>
              <div className="flex flex-wrap justify-center gap-2">
                {cities.map(city => (
                  <span key={city} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-primary-700 shadow-sm">
                    {city}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-3 h-3 bg-primary-600 rounded-full"></div>
              <div className="absolute top-8 right-8 w-3 h-3 bg-secondary-600 rounded-full"></div>
              <div className="absolute bottom-6 left-1/3 w-3 h-3 bg-primary-600 rounded-full"></div>
              <div className="absolute bottom-4 right-1/4 w-3 h-3 bg-secondary-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Routes</h3>
          <div className="space-y-3">
            {[
              { from: 'Patna', to: 'Gaya', price: '₹250' },
              { from: 'Patna', to: 'Muzaffarpur', price: '₹180' },
              { from: 'Gaya', to: 'Bhagalpur', price: '₹320' },
            ].map((route, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">{route.from} → {route.to}</p>
                  <p className="text-sm text-gray-500">Multiple buses available</p>
                </div>
                <span className="text-primary-600 font-bold">{route.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

