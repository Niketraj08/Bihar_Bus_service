import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Filter, Snowflake, Bed, Users, Clock } from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function BusListing() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchData = location.state || { source: 'Patna', destination: 'Gaya', date: new Date().toISOString().split('T')[0] }
  
  const [filters, setFilters] = useState({
    ac: false,
    sleeper: false,
    seater: false
  })

  const buses = [
    {
      id: 1,
      operator: 'Bihar State Transport',
      route: 'BR-502',
      type: 'AC Sleeper',
      departure: '06:00 AM',
      arrival: '10:30 AM',
      duration: '4h 30m',
      price: 450,
      seatsAvailable: 12,
      totalSeats: 40,
      amenities: ['AC', 'Sleeper', 'WiFi']
    },
    {
      id: 2,
      operator: 'Bihar Express',
      route: 'BR-305',
      type: 'Non-AC Seater',
      departure: '07:30 AM',
      arrival: '11:45 AM',
      duration: '4h 15m',
      price: 250,
      seatsAvailable: 28,
      totalSeats: 45,
      amenities: ['Seater']
    },
    {
      id: 3,
      operator: 'Bihar Deluxe',
      route: 'BR-401',
      type: 'AC Seater',
      departure: '08:00 AM',
      arrival: '12:30 PM',
      duration: '4h 30m',
      price: 350,
      seatsAvailable: 8,
      totalSeats: 40,
      amenities: ['AC', 'Seater', 'WiFi']
    },
  ]

  const handleSelectSeats = (bus) => {
    navigate('/seats', { state: { bus, searchData } })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Available Buses" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search Summary */}
        <div className="card mb-4 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-bold text-gray-800">{searchData.source}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-0.5 bg-primary-600"></div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">To</p>
              <p className="font-bold text-gray-800">{searchData.destination}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{new Date(searchData.date).toLocaleDateString()}</p>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={20} className="text-primary-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, ac: !filters.ac })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                filters.ac ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Snowflake size={16} />
              <span>AC</span>
            </button>
            <button
              onClick={() => setFilters({ ...filters, sleeper: !filters.sleeper })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                filters.sleeper ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Bed size={16} />
              <span>Sleeper</span>
            </button>
            <button
              onClick={() => setFilters({ ...filters, seater: !filters.seater })}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                filters.seater ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Users size={16} />
              <span>Seater</span>
            </button>
          </div>
        </div>

        {/* Bus List */}
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{bus.operator}</h3>
                  <p className="text-sm text-gray-500">{bus.route} • {bus.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">₹{bus.price}</p>
                  <p className="text-xs text-gray-500">per seat</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Departure</p>
                    <p className="text-sm font-semibold text-gray-800">{bus.departure}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Arrival</p>
                    <p className="text-sm font-semibold text-gray-800">{bus.arrival}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {bus.seatsAvailable} seats available
                  </span>
                </div>
                <span className="text-sm text-gray-500">{bus.duration}</span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                {bus.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                    {amenity}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleSelectSeats(bus)}
                className="btn-primary w-full"
              >
                Select Seats
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

