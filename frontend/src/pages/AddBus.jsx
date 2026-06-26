import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import { adminAPI } from '../services/api'

export default function AddBus() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [busData, setBusData] = useState({
    busNumber: '',
    busName: '',
    type: 'AC',
    totalSeats: '',
    route: '',
    driver: '',
    status: 'active',
    gpsStatus: 'online',
    description: '',
    amenities: [],
    departureTime: '',
    arrivalTime: '',
    fare: {
      base: '',
      additional: ''
    }
  })

  const [availableRoutes] = useState([
    { id: '1', name: 'Patna-Gaya', value: 'patna_gaya' },
    { id: '2', name: 'Muzaffarpur-Patna', value: 'muzaffarpur_patna' },
    { id: '3', name: 'Gaya-Bhagalpur', value: 'gaya_bhagalpur' },
    { id: '4', name: 'Darbhanga-Patna', value: 'darbhanga_patna' },
  ])

  const [availableDrivers] = useState([
    { id: '1', name: 'Rajesh Kumar', phone: '9876543210' },
    { id: '2', name: 'Amit Singh', phone: '9876543211' },
    { id: '3', name: 'Suresh Yadav', phone: '9876543212' },
    { id: '4', name: 'Mohan Das', phone: '9876543213' },
    { id: '5', name: 'Vikash Kumar', phone: '9876543214' },
  ])

  const busTypes = [
    { value: 'AC', label: 'AC Sleeper' },
    { value: 'NonAC', label: 'Non-AC Sleeper' },
    { value: 'ACSeater', label: 'AC Seater' },
    { value: 'NonACSeater', label: 'Non-AC Seater' },
    { value: 'Luxury', label: 'Luxury Coach' }
  ]

  const amenities = [
    'WiFi', 'USB Charging', 'Water Bottle', 'Blanket',
    'Pillow', 'TV', 'AC', 'Emergency Exit', 'First Aid Kit'
  ]

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBusData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBusData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleAmenityToggle = (amenity) => {
    setBusData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validateForm = () => {
    if (!busData.busNumber.trim()) return 'Bus number is required'
    if (!busData.busName.trim()) return 'Bus name is required'
    if (!busData.totalSeats || busData.totalSeats < 1) return 'Valid total seats is required'
    if (!busData.route) return 'Route selection is required'
    if (!busData.driver) return 'Driver selection is required'
    if (!busData.departureTime) return 'Departure time is required'
    if (!busData.arrivalTime) return 'Arrival time is required'
    if (!busData.fare.base || busData.fare.base < 0) return 'Base fare is required'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // Prepare data for API
      const submitData = {
        ...busData,
        totalSeats: parseInt(busData.totalSeats),
        fare: {
          base: parseFloat(busData.fare.base),
          additional: parseFloat(busData.fare.additional || 0)
        }
      }

      // In a real app, this would call the API
      // await adminAPI.createBus(submitData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess(true)

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/admin')
      }, 3000)

    } catch (error) {
      console.error('Error creating bus:', error)
      setError(error.response?.data?.message || 'Failed to create bus. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header title="Add New Bus" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Bus Added Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Bus {busData.busNumber} has been added to the system and is ready for operations.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Admin Panel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Add New Bus" />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Add New Bus</h1>
              <p className="text-gray-400">Create a new bus for your fleet</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Bus className="text-primary-400" size={20} />
                <span>Basic Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bus Number *
                  </label>
                  <input
                    type="text"
                    value={busData.busNumber}
                    onChange={(e) => handleInputChange('busNumber', e.target.value)}
                    placeholder="e.g., BR-505"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bus Name *
                  </label>
                  <input
                    type="text"
                    value={busData.busName}
                    onChange={(e) => handleInputChange('busName', e.target.value)}
                    placeholder="e.g., Bihar Express"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bus Type *
                  </label>
                  <select
                    value={busData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    {busTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    value={busData.totalSeats}
                    onChange={(e) => handleInputChange('totalSeats', e.target.value)}
                    placeholder="e.g., 50"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Route & Driver */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Route & Driver Assignment</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Route *
                  </label>
                  <select
                    value={busData.route}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select Route</option>
                    {availableRoutes.map(route => (
                      <option key={route.id} value={route.value}>{route.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Driver *
                  </label>
                  <select
                    value={busData.driver}
                    onChange={(e) => handleInputChange('driver', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select Driver</option>
                    {availableDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Schedule & Fare</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    value={busData.departureTime}
                    onChange={(e) => handleInputChange('departureTime', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Arrival Time *
                  </label>
                  <input
                    type="time"
                    value={busData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Base Fare (₹) *
                  </label>
                  <input
                    type="number"
                    value={busData.fare.base}
                    onChange={(e) => handleInputChange('fare.base', e.target.value)}
                    placeholder="e.g., 250"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Additional Charges (₹)
                </label>
                <input
                  type="number"
                  value={busData.fare.additional}
                  onChange={(e) => handleInputChange('fare.additional', e.target.value)}
                  placeholder="e.g., 50 (optional)"
                  min="0"
                  step="0.01"
                  className="w-full max-w-xs px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Amenities</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={busData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={busData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional description about the bus..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Bus...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Create Bus</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
