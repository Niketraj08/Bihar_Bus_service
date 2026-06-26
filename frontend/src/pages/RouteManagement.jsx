import { useState } from 'react'
import { MapPin, Plus, Save, Trash2, Route as RouteIcon } from 'lucide-react'
import Header from '../components/Header'

export default function RouteManagement() {
  const [routes] = useState([
    { id: 1, name: 'Patna-Gaya', start: 'Patna Junction', end: 'Gaya Bus Stand', stops: 8, status: 'active' },
    { id: 2, name: 'Muzaffarpur-Patna', start: 'Muzaffarpur Bus Stand', end: 'Patna Junction', stops: 12, status: 'active' },
    { id: 3, name: 'Gaya-Bhagalpur', start: 'Gaya Bus Stand', end: 'Bhagalpur Station', stops: 15, status: 'active' },
  ])

  const [newRoute, setNewRoute] = useState({
    name: '',
    start: '',
    end: '',
    stops: []
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Route Management" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Add Route Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Plus className="text-primary-400" size={20} />
            <span>Create New Route</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Route Name</label>
              <input
                type="text"
                placeholder="e.g., Patna-Gaya"
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Point</label>
                <input
                  type="text"
                  placeholder="Starting location"
                  value={newRoute.start}
                  onChange={(e) => setNewRoute({ ...newRoute, start: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">End Point</label>
                <input
                  type="text"
                  placeholder="Destination"
                  value={newRoute.end}
                  onChange={(e) => setNewRoute({ ...newRoute, end: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <RouteIcon className="text-secondary-400" size={20} />
            <span>Route Map</span>
          </h3>
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg h-96 relative overflow-hidden">
            {/* Simulated Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto text-primary-400 mb-2" size={48} />
                <p className="text-gray-400 font-medium">Interactive Map View</p>
                <p className="text-sm text-gray-500 mt-2">Click to add stops • Drag to adjust route</p>
              </div>
            </div>
            
            {/* Route Visualization */}
            <div className="absolute top-8 left-8">
              <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              <p className="text-xs text-gray-300 mt-1">Start</p>
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              <p className="text-xs text-gray-300 mt-1">End</p>
            </div>
            <div className="absolute top-1/2 left-1/3">
              <div className="bg-primary-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-1/3 right-1/4">
              <div className="bg-primary-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            
            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <path
                d="M 64 64 Q 200 150 300 200 T 600 400"
                fill="none"
                stroke="#00bcd4"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <MapPin size={16} />
              <span>Add Stop</span>
            </button>
            <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <Save size={16} />
              <span>Save Route</span>
            </button>
          </div>
        </div>

        {/* Existing Routes */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">Existing Routes</h3>
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{route.name}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{route.start}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{route.end}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-green-900 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    {route.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-400">{route.stops} intermediate stops</span>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

