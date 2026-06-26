import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MapPin, Clock, Battery, Radio, AlertCircle, Route } from 'lucide-react'
import GoogleMapReact from 'google-map-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

// Get Google Maps API key from environment variables
// To get a free API key: https://console.cloud.google.com/google/maps-apis
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyC_example_key_replace_with_real_one'

// Check if API key is valid (not the placeholder)
const isValidApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'AIzaSyC_example_key_replace_with_real_one' && GOOGLE_MAPS_API_KEY.startsWith('AIzaSy')

// Bihar state center coordinates
const BIHAR_CENTER = {
  lat: 25.0961,
  lng: 85.3131
}

// Available bus routes in Bihar
const AVAILABLE_ROUTES = {
  patna_gaya: {
    name: 'Patna → Gaya',
    busName: 'Bihar Express',
    routeNumber: 'BR-502',
    coordinates: [
      { lng: 85.1376, lat: 25.5941, name: 'Patna Junction', distance: 0 },
      { lng: 85.1450, lat: 25.6000, name: 'Gandhi Maidan', distance: 2 },
      { lng: 85.1000, lat: 25.5200, name: 'Fatuha', distance: 15 },
      { lng: 84.9500, lat: 25.3500, name: 'Masaurhi', distance: 35 },
      { lng: 84.7500, lat: 25.1500, name: 'Nalanda', distance: 55 },
      { lng: 84.6500, lat: 25.0500, name: 'Rajgir', distance: 70 },
      { lng: 84.9915, lat: 24.7969, name: 'Gaya Bus Stand', distance: 92 }
    ]
  },
  patna_muzaffarpur: {
    name: 'Patna → Muzaffarpur',
    busName: 'Bihar Super Fast',
    routeNumber: 'BR-101',
    coordinates: [
      { lng: 85.1376, lat: 25.5941, name: 'Patna Junction', distance: 0 },
      { lng: 85.2000, lat: 25.6500, name: 'Hajipur', distance: 25 },
      { lng: 85.3000, lat: 25.7000, name: 'Vaishali', distance: 45 },
      { lng: 85.4000, lat: 25.7500, name: 'Mahua', distance: 65 },
      { lng: 85.3833, lat: 26.1167, name: 'Muzaffarpur Bus Stand', distance: 85 }
    ]
  },
  patna_bhagalpur: {
    name: 'Patna → Bhagalpur',
    busName: 'Bihar Deluxe',
    routeNumber: 'BR-303',
    coordinates: [
      { lng: 85.1376, lat: 25.5941, name: 'Patna Junction', distance: 0 },
      { lng: 85.1000, lat: 25.5200, name: 'Fatuha', distance: 15 },
      { lng: 85.0500, lat: 25.4500, name: 'Khagaul', distance: 25 },
      { lng: 84.9500, lat: 25.3500, name: 'Masaurhi', distance: 45 },
      { lng: 84.8500, lat: 25.2500, name: 'Bihar Sharif', distance: 65 },
      { lng: 84.7500, lat: 25.1500, name: 'Nalanda', distance: 80 },
      { lng: 84.6500, lat: 25.0500, name: 'Rajgir', distance: 95 },
      { lng: 84.5500, lat: 24.9500, name: 'Nawada', distance: 115 },
      { lng: 84.4500, lat: 24.8500, name: 'Hisua', distance: 135 },
      { lng: 84.3500, lat: 24.7500, name: 'Jamui', distance: 155 },
      { lng: 84.2500, lat: 24.6500, name: 'Jhajha', distance: 175 },
      { lng: 84.1500, lat: 24.5500, name: 'Jasidih', distance: 195 },
      { lng: 84.0500, lat: 24.4500, name: 'Banka', distance: 215 },
      { lng: 83.9500, lat: 24.3500, name: 'Amarpur', distance: 235 },
      { lng: 83.8500, lat: 24.2500, name: 'Sultanganj', distance: 255 },
      { lng: 83.7500, lat: 24.1500, name: 'Bhagalpur Bus Stand', distance: 275 }
    ]
  },
  patna_darbhanga: {
    name: 'Patna → Darbhanga',
    busName: 'Bihar AC Bus',
    routeNumber: 'BR-201',
    coordinates: [
      { lng: 85.1376, lat: 25.5941, name: 'Patna Junction', distance: 0 },
      { lng: 85.2000, lat: 25.6500, name: 'Hajipur', distance: 25 },
      { lng: 85.3000, lat: 25.7000, name: 'Vaishali', distance: 45 },
      { lng: 85.3500, lat: 25.7500, name: 'Mahua', distance: 60 },
      { lng: 85.4000, lat: 25.8000, name: 'Mahnar', distance: 75 },
      { lng: 85.4500, lat: 25.8500, name: 'Barauni', distance: 90 },
      { lng: 85.5000, lat: 25.9000, name: 'Begusarai', distance: 105 },
      { lng: 85.5500, lat: 25.9500, name: 'Dalsinghsarai', distance: 120 },
      { lng: 85.6000, lat: 26.0000, name: 'Samastipur', distance: 135 },
      { lng: 85.6500, lat: 26.0500, name: 'Rosera', distance: 150 },
      { lng: 85.7000, lat: 26.1000, name: 'Hasanpur Road', distance: 165 },
      { lng: 85.7500, lat: 26.1500, name: 'Biraul', distance: 180 },
      { lng: 85.8000, lat: 26.2000, name: 'Laheriasarai', distance: 195 },
      { lng: 85.8500, lat: 26.2500, name: 'Darbhanga Bus Stand', distance: 210 }
    ]
  },
  gaya_bodh_gaya: {
    name: 'Gaya → Bodh Gaya',
    busName: 'Bihar Pilgrim',
    routeNumber: 'BR-601',
    coordinates: [
      { lng: 84.9915, lat: 24.7969, name: 'Gaya Bus Stand', distance: 0 },
      { lng: 84.9500, lat: 24.7500, name: 'Bodh Gaya Temple', distance: 8 },
      { lng: 84.9000, lat: 24.7000, name: 'Mahabodhi Temple', distance: 12 },
      { lng: 84.8500, lat: 24.6500, name: 'Bodh Gaya Market', distance: 15 }
    ]
  }
}

export default function LiveTracking() {
  const [selectedRoute, setSelectedRoute] = useState('patna_gaya')
  const routeData = AVAILABLE_ROUTES[selectedRoute]
  const routeCoordinates = routeData.coordinates

  const navigate = useNavigate()

  const [busData, setBusData] = useState({
    routeNumber: routeData.routeNumber,
    busName: routeData.busName,
    nextStop: routeCoordinates[1]?.name || 'Destination',
    eta: '15 min',
    distance: `${routeCoordinates[routeCoordinates.length - 1]?.distance || 0} km`,
    battery: 85,
    gpsStatus: 'Strong',
    currentLocation: routeCoordinates[0]?.name || 'Starting Point',
    latitude: routeCoordinates[0]?.lat || 25.5941,
    longitude: routeCoordinates[0]?.lng || 85.1376,
    speed: 80, // km/h - faster highway speed for engaging demo
    totalDistance: routeCoordinates[routeCoordinates.length - 1]?.distance || 0,
    currentProgress: 0
  })

  const [viewState, setViewState] = useState({
    longitude: busData.longitude,
    latitude: busData.latitude,
    zoom: 13
  })

  const [currentRouteIndex, setCurrentRouteIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(20000) // milliseconds between updates - slow default for better viewing

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Simulate bus movement
  useEffect(() => {
    if (!isMoving) return

    const interval = setInterval(() => {
      setCurrentRouteIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % routeCoordinates.length
        const currentPoint = routeCoordinates[prevIndex]
        const nextPoint = routeCoordinates[nextIndex]

        // Calculate distance to next point
        const distanceToNext = calculateDistance(
          currentPoint.lat, currentPoint.lng,
          nextPoint.lat, nextPoint.lng
        )

        // Update bus data
        setBusData(prevData => {
          const newProgress = (nextPoint.distance / prevData.totalDistance) * 100
          const remainingDistance = prevData.totalDistance - nextPoint.distance
          const etaMinutes = Math.ceil((remainingDistance / prevData.speed) * 60)

          return {
            ...prevData,
            latitude: nextPoint.lat,
            longitude: nextPoint.lng,
            currentLocation: nextPoint.name,
            nextStop: routeCoordinates[nextIndex + 1]?.name || 'Gaya Bus Stand',
            distance: `${remainingDistance.toFixed(1)} km`,
            eta: etaMinutes > 60 ? `${Math.floor(etaMinutes/60)}h ${etaMinutes%60}m` : `${etaMinutes} min`,
            currentProgress: newProgress,
            battery: Math.max(15, prevData.battery - Math.random() * 0.5) // Battery slowly drains
          }
        })

        // Update map view to follow the bus
        setViewState(prevState => ({
          ...prevState,
          longitude: nextPoint.lng,
          latitude: nextPoint.lat
        }))

        return nextIndex
      })
    }, simulationSpeed) // Dynamic speed control

    return () => clearInterval(interval)
  }, [isMoving, routeCoordinates, simulationSpeed])

  // Update bus data when route changes
  useEffect(() => {
    const newRouteData = AVAILABLE_ROUTES[selectedRoute]
    const newCoordinates = newRouteData.coordinates

    setBusData(prevData => ({
      ...prevData,
      routeNumber: newRouteData.routeNumber,
      busName: newRouteData.busName,
      nextStop: newCoordinates[1]?.name || 'Destination',
      distance: `${newCoordinates[newCoordinates.length - 1]?.distance || 0} km`,
      currentLocation: newCoordinates[0]?.name || 'Starting Point',
      latitude: newCoordinates[0]?.lat || 25.5941,
      longitude: newCoordinates[0]?.lng || 85.1376,
      totalDistance: newCoordinates[newCoordinates.length - 1]?.distance || 0,
      currentProgress: 0
    }))

    setCurrentRouteIndex(0)
    setViewState({
      longitude: newCoordinates[0]?.lng || 85.1376,
      latitude: newCoordinates[0]?.lat || 25.5941,
      zoom: 11
    })
  }, [selectedRoute])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Live Bus Tracking" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Route Info Card */}
        <div className="card mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-primary-100">Route Number</p>
              <h2 className="text-2xl font-bold">{busData.routeNumber}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-100">Bus Name</p>
              <p className="text-lg font-semibold">{busData.busName}</p>
            </div>
          </div>
        </div>

        {/* Main Tracking Box with Mapbox Map */}
        <div className="card mb-4 p-0 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Live Bus Location</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin/routes')}
                  className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Route size={16} />
                  <span>View Plan</span>
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Tracking</span>
                </div>
              </div>
            </div>

            {/* Route Selector */}
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <label className="block text-sm font-medium text-primary-100 mb-2">Select Route:</label>
              <select
                value={selectedRoute}
                onChange={(e) => {
                  setSelectedRoute(e.target.value)
                  setCurrentRouteIndex(0)
                  setIsMoving(false)
                }}
                className="w-full px-3 py-2 bg-white text-gray-800 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {Object.entries(AVAILABLE_ROUTES).map(([key, route]) => (
                  <option key={key} value={key}>
                    {route.name} - {route.busName}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-primary-200">
                📍 {routeData.name} • {routeCoordinates.length - 1} stops • {routeCoordinates[routeCoordinates.length - 1]?.distance || 0} km
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${busData.currentProgress}%` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMoving(!isMoving)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isMoving
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isMoving ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span>{isMoving ? 'Live Tracking' : 'Paused'}</span>
                </div>
              </div>
              <div className="text-right">
              <div className="text-sm text-gray-600">
                Speed: <span className="font-semibold text-primary-600">{busData.speed} km/h</span>
              </div>
              <div className="text-xs text-gray-500">
                ETA: ~{Math.ceil((routeCoordinates.length * simulationSpeed) / 1000)} sec ({Math.ceil((routeCoordinates.length * simulationSpeed) / 1000 / 60)} min)
              </div>
              </div>
            </div>

            {/* Speed Control */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Simulation Speed:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSimulationSpeed(3000)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    simulationSpeed === 3000
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐌 Very Slow
                </button>
                <button
                  onClick={() => setSimulationSpeed(2000)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    simulationSpeed === 2000
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐌 Slow
                </button>
                <button
                  onClick={() => setSimulationSpeed(1000)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    simulationSpeed === 1000
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🏃 Normal
                </button>
                <button
                  onClick={() => setSimulationSpeed(500)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    simulationSpeed === 500
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⚡ Fast
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 w-full relative rounded-lg overflow-hidden">
            {isValidApiKey ? (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: GOOGLE_MAPS_API_KEY,
                  libraries: ['places', 'geometry']
                }}
                defaultCenter={{
                  lat: busData.latitude,
                  lng: busData.longitude
                }}
                center={{
                  lat: busData.latitude,
                  lng: busData.longitude
                }}
                defaultZoom={11}
                options={{
                  zoomControl: true,
                  mapTypeControl: true,
                  scaleControl: true,
                  streetViewControl: false,
                  rotateControl: false,
                  fullscreenControl: true,
                  styles: [
                    {
                      featureType: 'administrative',
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#444444' }]
                    },
                    {
                      featureType: 'landscape',
                      elementType: 'all',
                      stylers: [{ color: '#f2f2f2' }]
                    },
                    {
                      featureType: 'poi',
                      elementType: 'all',
                      stylers: [{ visibility: 'off' }]
                    },
                    {
                      featureType: 'road',
                      elementType: 'all',
                      stylers: [{ saturation: -100 }, { lightness: 45 }]
                    },
                    {
                      featureType: 'road.highway',
                      elementType: 'all',
                      stylers: [{ visibility: 'simplified' }]
                    },
                    {
                      featureType: 'road.arterial',
                      elementType: 'labels.icon',
                      stylers: [{ visibility: 'off' }]
                    },
                    {
                      featureType: 'transit',
                      elementType: 'all',
                      stylers: [{ visibility: 'off' }]
                    },
                    {
                      featureType: 'water',
                      elementType: 'all',
                      stylers: [{ color: '#b4d4e1' }, { visibility: 'on' }]
                    }
                  ]
                }}
                onGoogleApiLoaded={({ map, maps }) => {
                  console.log('Google Maps API loaded successfully')
                }}
                onError={(error) => {
                  console.error('Google Maps API error:', error)
                }}
                yesIWantToUseGoogleMapApiInternals
              >
                {/* Route Path Visualization */}
                {routeCoordinates.map((point, index) => {
                  const isPassed = index <= currentRouteIndex
                  const isCurrent = index === currentRouteIndex
                  const isNext = index === currentRouteIndex + 1

                  return (
                    <div
                      key={`route-${index}`}
                      lat={point.lat}
                      lng={point.lng}
                      style={{
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                        isCurrent
                          ? 'bg-primary-600 animate-ping'
                          : isPassed
                          ? 'bg-green-500'
                          : isNext
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}>
                        {isCurrent && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
                      </div>
                    </div>
                  )
                })}

                {/* Bus Current Location Marker */}
                <div
                  lat={busData.latitude}
                  lng={busData.longitude}
                  style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <div className="bg-primary-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-xl animate-bounce border-2 border-white relative">
                    🚌
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Next Stop Marker */}
                {currentRouteIndex + 1 < routeCoordinates.length && (
                  <div
                    lat={routeCoordinates[currentRouteIndex + 1].lat}
                    lng={routeCoordinates[currentRouteIndex + 1].lng}
                    style={{
                      position: 'absolute',
                      transform: 'translate(-50%, -100%)',
                      zIndex: 5
                    }}
                  >
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-white whitespace-nowrap">
                      📍 Next: {routeCoordinates[currentRouteIndex + 1].name}
                    </div>
                  </div>
                )}

                {/* Start Point Marker */}
                <div
                  lat={routeCoordinates[0]?.lat}
                  lng={routeCoordinates[0]?.lng}
                  style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -100%)',
                    zIndex: 5
                  }}
                >
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-white whitespace-nowrap">
                    🏁 Start: {routeCoordinates[0]?.name}
                  </div>
                </div>

                {/* Destination Marker */}
                <div
                  lat={routeCoordinates[routeCoordinates.length - 1]?.lat}
                  lng={routeCoordinates[routeCoordinates.length - 1]?.lng}
                  style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -100%)',
                    zIndex: 5
                  }}
                >
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-white whitespace-nowrap">
                    🎯 End: {routeCoordinates[routeCoordinates.length - 1]?.name}
                  </div>
                </div>
              </GoogleMapReact>
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Please configure a valid Google Maps API key to view the live map.
                  </p>
                  <p className="text-xs text-gray-400">
                    Get a free API key at{' '}
                    <a
                      href="https://console.cloud.google.com/google/maps-apis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <MapPin className="text-primary-600 animate-pulse" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-bold text-gray-800">{busData.currentLocation}</p>
                <p className="text-xs text-green-600 font-medium">🚌 Bus is moving</p>
              </div>
            </div>

            {/* Journey Progress */}
            <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Journey Progress</span>
                <span>{busData.currentProgress.toFixed(1)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${busData.currentProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Latitude</p>
                <p className="text-sm font-semibold text-gray-700">{busData.latitude.toFixed(4)}° N</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Longitude</p>
                <p className="text-sm font-semibold text-gray-700">{busData.longitude.toFixed(4)}° E</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="text-primary-600 animate-pulse" size={20} />
              <p className="text-sm text-gray-600">Next Stop</p>
            </div>
            <p className="font-bold text-gray-800">{busData.nextStop}</p>
            <p className="text-xs text-gray-500 mt-1">📍 {busData.currentLocation}</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-600 font-medium">Approaching</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-secondary-600" size={20} />
              <p className="text-sm text-gray-600">ETA to Destination</p>
            </div>
            <p className="font-bold text-gray-800">{busData.eta}</p>
            <p className="text-xs text-gray-500 mt-1">🚗 {busData.distance} remaining</p>
            <div className="mt-2 text-xs text-gray-600">
              Speed: <span className="font-semibold text-primary-600">{busData.speed} km/h</span>
            </div>
          </div>
        </div>

        {/* GPS & Battery Status */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="text-green-600" size={20} />
                <span className="text-sm text-gray-700">GPS Signal</span>
              </div>
              <span className="text-sm font-semibold text-green-600">{busData.gpsStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className="text-primary-600" size={20} />
                <span className="text-sm text-gray-700">Battery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all"
                    style={{ width: `${busData.battery}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{busData.battery}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="btn-primary w-full flex items-center justify-center space-x-2">
            <Bell size={20} />
            <span>Set Alert</span>
          </button>
          <button className="btn-secondary w-full flex items-center justify-center space-x-2">
            <AlertCircle size={20} />
            <span>Notify Me</span>
          </button>
        </div>

          {/* Route Progress */}
          <div className="card mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Route Progress - {routeData.name}</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {routeCoordinates.map((stop, idx) => {
                const isCompleted = idx < currentRouteIndex
                const isCurrent = idx === currentRouteIndex
                const isNext = idx === currentRouteIndex + 1

                return (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      isCurrent
                        ? 'bg-primary-600 animate-ping'
                        : isCompleted
                        ? 'bg-green-500'
                        : isNext
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}>
                      {isCurrent && <div className="w-4 h-4 bg-primary-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isCurrent ? 'text-primary-600' :
                        isCompleted ? 'text-green-600' :
                        isNext ? 'text-yellow-600' : 'text-gray-700'
                      }`}>
                        {stop.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>📍 {stop.distance} km from start</span>
                        {isCurrent && <span className="text-green-600 font-medium">🚌 Bus here</span>}
                      </div>
                    </div>
                    {isNext && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                        Next Stop
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✓ Passed
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Route Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-primary-600">{currentRouteIndex + 1}</p>
                  <p className="text-xs text-gray-500">Stops Completed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-secondary-600">{Math.max(0, routeCoordinates.length - currentRouteIndex - 1)}</p>
                  <p className="text-xs text-gray-500">Stops Remaining</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{busData.currentProgress.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">Journey Done</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      <BottomNavigation />
    </div>
  )
}


