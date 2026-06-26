import { useState } from 'react'
import { Bus, Plus, Edit, Trash2, Radio, CheckCircle, XCircle, Wrench } from 'lucide-react'
import Header from '../components/Header'

export default function BusManagement() {
  const [activeTab, setActiveTab] = useState('all') // 'all', 'active', 'offline', 'maintenance'
  const [buses] = useState([
    { id: 1, number: 'BR-502', name: 'Bihar Express', route: 'Patna-Gaya', status: 'active', gps: 'online', driver: 'Rajesh Kumar' },
    { id: 2, number: 'BR-305', name: 'Bihar Deluxe', route: 'Muzaffarpur-Patna', status: 'active', gps: 'online', driver: 'Amit Singh' },
    { id: 3, number: 'BR-401', name: 'Bihar State', route: 'Gaya-Bhagalpur', status: 'offline', gps: 'offline', driver: 'Suresh Yadav' },
    { id: 4, number: 'BR-208', name: 'Bihar Express', route: 'Darbhanga-Patna', status: 'maintenance', gps: 'offline', driver: 'Mohan Das' },
    { id: 5, number: 'BR-601', name: 'Bihar Deluxe', route: 'Patna-Muzaffarpur', status: 'active', gps: 'online', driver: 'Vikash Kumar' },
  ])

  const filteredBuses = buses.filter(bus => {
    if (activeTab === 'all') return true
    return bus.status === activeTab
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-400'
      case 'offline': return 'bg-gray-700 text-gray-400'
      case 'maintenance': return 'bg-yellow-900 text-yellow-400'
      default: return 'bg-gray-700 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Bus Management" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Buses', count: buses.length },
            { id: 'active', label: 'Active', count: buses.filter(b => b.status === 'active').length },
            { id: 'offline', label: 'Offline', count: buses.filter(b => b.status === 'offline').length },
            { id: 'maintenance', label: 'Maintenance', count: buses.filter(b => b.status === 'maintenance').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Add Bus Button */}
        <button className="mb-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>Add New Bus</span>
        </button>

        {/* Bus List */}
        <div className="space-y-4">
          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <Bus className="text-primary-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{bus.number}</h3>
                    <p className="text-sm text-gray-400">{bus.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{bus.route}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                  {bus.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  {bus.gps === 'online' ? (
                    <Radio className="text-green-400" size={16} />
                  ) : (
                    <Radio className="text-gray-500" size={16} />
                  )}
                  <span className="text-sm text-gray-300">GPS: {bus.gps}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Driver:</span>
                  <span className="text-sm text-gray-300">{bus.driver}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="flex-1 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

