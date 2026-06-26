import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, MapPin, Clock, QrCode, Ticket, TrendingUp, Plus } from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'
import AddMoneyModal from '../components/AddMoneyModal'

export default function UserDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    walletBalance: 1250,
    totalTrips: 12,
    activeJourney: {
      route: 'BR-502',
      from: 'Patna',
      to: 'Gaya',
      date: '2026-01-15',
      time: '06:00 AM',
      seat: '5A',
      ticketId: 'BBS-2026-001234'
    }
  })

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)

  const recentTrips = [
    { id: 1, from: 'Patna', to: 'Muzaffarpur', date: '2026-01-10', price: 180, status: 'completed' },
    { id: 2, from: 'Gaya', to: 'Bhagalpur', date: '2026-01-08', price: 320, status: 'completed' },
    { id: 3, from: 'Darbhanga', to: 'Patna', date: '2026-01-05', price: 200, status: 'completed' },
  ]

  const quickRoutes = [
    { from: 'Patna', to: 'Gaya', price: '₹250' },
    { from: 'Patna', to: 'Muzaffarpur', price: '₹180' },
    { from: 'Gaya', to: 'Bhagalpur', price: '₹320' },
  ]

  const handleAddMoneySuccess = (newBalance) => {
    setUserData(prev => ({
      ...prev,
      walletBalance: newBalance
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="My Dashboard" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Wallet & Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div className="flex items-center justify-between mb-2">
              <Wallet size={24} />
              <button
                onClick={() => setShowAddMoneyModal(true)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
              >
                <Plus size={20} className="hover:scale-110 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-primary-100 mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold">₹{userData.walletBalance}</p>
          </div>

          <div className="card bg-gradient-to-br from-secondary-600 to-secondary-700 text-white">
            <Ticket size={24} className="mb-2" />
            <p className="text-sm text-secondary-100 mb-1">Total Trips</p>
            <p className="text-2xl font-bold">{userData.totalTrips}</p>
          </div>
        </div>

        {/* Active Journey */}
        {userData.activeJourney && (
          <div className="card mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Active Journey</h3>
                <p className="text-sm text-gray-600">{userData.activeJourney.from} → {userData.activeJourney.to}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <QrCode size={32} className="text-primary-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Route</p>
                <p className="font-semibold text-gray-800">{userData.activeJourney.route}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Seat</p>
                <p className="font-semibold text-gray-800">{userData.activeJourney.seat}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{userData.activeJourney.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-semibold text-gray-800">{userData.activeJourney.time}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Ticket ID: {userData.activeJourney.ticketId}</p>
          </div>
        )}

        {/* Quick Routes */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Quick Routes</h3>
            <TrendingUp className="text-primary-600" size={20} />
          </div>
          <div className="space-y-2">
            {quickRoutes.map((route, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/', { state: { source: route.from, destination: route.to } })}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary-600" size={16} />
                  <span className="font-medium text-gray-800">{route.from} → {route.to}</span>
                </div>
                <span className="text-primary-600 font-bold">{route.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Trips</h3>
            <Clock className="text-primary-600" size={20} />
          </div>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="text-primary-600" size={16} />
                    <span className="font-semibold text-gray-800">{trip.from} → {trip.to}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{trip.date}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                      {trip.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">₹{trip.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pass/Subscription Banner */}
        <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <h3 className="font-bold text-lg mb-2">Get Monthly Pass</h3>
          <p className="text-sm text-primary-100 mb-4">
            Save up to 30% on your daily commute with our monthly subscription pass
          </p>
          <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            View Plans
          </button>
        </div>
      </div>

      <BottomNavigation />

      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        onSuccess={handleAddMoneySuccess}
      />
    </div>
  )
}

