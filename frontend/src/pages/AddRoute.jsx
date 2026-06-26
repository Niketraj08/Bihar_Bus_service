import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Route, ArrowLeft, Save, AlertCircle, CheckCircle, Plus, X, MapPin } from 'lucide-react'
import Header from '../components/Header'
import { adminAPI } from '../services/api'

export default function AddRoute() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [routeData, setRouteData] = useState({
    routeNumber: '',
    routeName: '',
    startPoint: {
      name: '',
      coordinates: { latitude: '', longitude: '' },
      address: ''
    },
    endPoint: {
      name: '',
      coordinates: { latitude: '', longitude: '' },
      address: ''
    },
    stops: [],
    distance: '',
    duration: '',
    status: 'active'
  })

  const [newStop, setNewStop] = useState({
    name: '',
    coordinates: { latitude: '', longitude: '' },
    address: '',
    sequence: 1,
    estimatedTime: ''
  })

  const cities = [
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga',
    'Ara', 'Bihar Sharif', 'Hajipur', 'Katihar', 'Munger',
    'Purnia', 'Saharsa', 'Samastipur', 'Sasaram', 'Sitamarhi'
  ]

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      if (parent === 'startPoint' || parent === 'endPoint') {
        setRouteData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      } else if (field.startsWith('startPoint.coordinates.') || field.startsWith('endPoint.coordinates.')) {
        const [parent, , coord] = field.split('.')
        setRouteData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            coordinates: {
              ...prev[parent].coordinates,
              [coord]: value
            }
          }
        }))
      }
    } else {
      setRouteData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNewStopChange = (field, value) => {
    if (field.includes('.')) {
      const [, coord] = field.split('.')
      setNewStop(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coord]: value
        }
      }))
    } else {
      setNewStop(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addStop = () => {
    if (!newStop.name.trim()) {
      setError('Stop name is required')
      return
    }

    const stopToAdd = {
      ...newStop,
      sequence: routeData.stops.length + 1
    }

    setRouteData(prev => ({
      ...prev,
      stops: [...prev.stops, stopToAdd]
    }))

    // Reset new stop form
    setNewStop({
      name: '',
      coordinates: { latitude: '', longitude: '' },
      address: '',
      sequence: routeData.stops.length + 2,
      estimatedTime: ''
    })

    setError('')
  }

  const removeStop = (index) => {
    setRouteData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index).map((stop, i) => ({
        ...stop,
        sequence: i + 1
      }))
    }))
  }

  const validateForm = () => {
    if (!routeData.routeNumber.trim()) return 'Route number is required'
    if (!routeData.routeName.trim()) return 'Route name is required'
    if (!routeData.startPoint.name.trim()) return 'Start point name is required'
    if (!routeData.endPoint.name.trim()) return 'End point name is required'
    if (!routeData.distance || routeData.distance <= 0) return 'Valid distance is required'
    if (!routeData.duration || routeData.duration <= 0) return 'Valid duration is required'

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
        ...routeData,
        distance: parseFloat(routeData.distance),
        duration: parseInt(routeData.duration),
        startPoint: {
          ...routeData.startPoint,
          coordinates: {
            latitude: parseFloat(routeData.startPoint.coordinates.latitude),
            longitude: parseFloat(routeData.startPoint.coordinates.longitude)
          }
        },
        endPoint: {
          ...routeData.endPoint,
          coordinates: {
            latitude: parseFloat(routeData.endPoint.coordinates.latitude),
            longitude: parseFloat(routeData.endPoint.coordinates.longitude)
          }
        },
        stops: routeData.stops.map(stop => ({
          ...stop,
          coordinates: {
            latitude: parseFloat(stop.coordinates.latitude),
            longitude: parseFloat(stop.coordinates.longitude)
          },
          estimatedTime: parseInt(stop.estimatedTime)
        }))
      }

      // In a real app, this would call the API
      // await adminAPI.createRoute(submitData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess(true)

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/admin')
      }, 3000)

    } catch (error) {
      console.error('Error creating route:', error)
      setError(error.response?.data?.message || 'Failed to create route. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header title="Add New Route" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Route Added Successfully!</h2>
            <p className="text-gray-400 mb-6">
              Route {routeData.routeName} has been added to the system.
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
      <Header title="Add New Route" />

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
              <h1 className="text-2xl font-bold">Add New Route</h1>
              <p className="text-gray-400">Create a new bus route for your network</p>
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
                <Route className="text-primary-400" size={20} />
                <span>Basic Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Route Number *
                  </label>
                  <input
                    type="text"
                    value={routeData.routeNumber}
                    onChange={(e) => handleInputChange('routeNumber', e.target.value)}
                    placeholder="e.g., BR-101"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Route Name *
                  </label>
                  <input
                    type="text"
                    value={routeData.routeName}
                    onChange={(e) => handleInputChange('routeName', e.target.value)}
                    placeholder="e.g., Patna to Gaya"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    value={routeData.distance}
                    onChange={(e) => handleInputChange('distance', e.target.value)}
                    placeholder="e.g., 92"
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={routeData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 120"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Start Point */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <MapPin className="text-green-400" size={20} />
                <span>Start Point</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location Name *
                  </label>
                  <select
                    value={routeData.startPoint.name}
                    onChange={(e) => handleInputChange('startPoint.name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={routeData.startPoint.address}
                    onChange={(e) => handleInputChange('startPoint.address', e.target.value)}
                    placeholder="Detailed address"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={routeData.startPoint.coordinates.latitude}
                    onChange={(e) => handleInputChange('startPoint.coordinates.latitude', e.target.value)}
                    placeholder="e.g., 25.5941"
                    step="0.0001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={routeData.startPoint.coordinates.longitude}
                    onChange={(e) => handleInputChange('startPoint.coordinates.longitude', e.target.value)}
                    placeholder="e.g., 85.1376"
                    step="0.0001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* End Point */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <MapPin className="text-red-400" size={20} />
                <span>End Point</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location Name *
                  </label>
                  <select
                    value={routeData.endPoint.name}
                    onChange={(e) => handleInputChange('endPoint.name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={routeData.endPoint.address}
                    onChange={(e) => handleInputChange('endPoint.address', e.target.value)}
                    placeholder="Detailed address"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={routeData.endPoint.coordinates.latitude}
                    onChange={(e) => handleInputChange('endPoint.coordinates.latitude', e.target.value)}
                    placeholder="e.g., 24.7969"
                    step="0.0001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={routeData.endPoint.coordinates.longitude}
                    onChange={(e) => handleInputChange('endPoint.coordinates.longitude', e.target.value)}
                    placeholder="e.g., 84.9915"
                    step="0.0001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Stops */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Intermediate Stops</h2>

              {/* Add New Stop */}
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Add Stop</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Stop Name
                    </label>
                    <select
                      value={newStop.name}
                      onChange={(e) => handleNewStopChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Est. Time (min)
                    </label>
                    <input
                      type="number"
                      value={newStop.estimatedTime}
                      onChange={(e) => handleNewStopChange('estimatedTime', e.target.value)}
                      placeholder="15"
                      min="1"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addStop}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Stop</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Stops */}
              {routeData.stops.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Route Stops ({routeData.stops.length})</h3>
                  {routeData.stops.map((stop, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {stop.sequence}
                        </div>
                        <div>
                          <p className="font-medium">{stop.name}</p>
                          <p className="text-sm text-gray-400">{stop.estimatedTime} min from start</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="p-2 hover:bg-red-900 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    <span>Creating Route...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Create Route</span>
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
