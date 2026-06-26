import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Bus,
  Route,
  Users,
  Ticket,
  Settings,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Wrench,
  Radio,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  UserCheck,
  UserX,
  Eye,
  Ban,
  Star,
  Calendar,
  Activity
} from 'lucide-react'
import Header from '../components/Header'

export default function AdminControlPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Edit/Delete state
  const [editingBus, setEditingBus] = useState(null)
  const [editingRoute, setEditingRoute] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ type: null, item: null })
  const [editFormData, setEditFormData] = useState({})

  // Edit/Delete functions
  const handleEditBus = (bus) => {
    setEditingBus(bus.id)
    setEditFormData({
      name: bus.name,
      number: bus.number,
      status: bus.status,
      route: bus.route,
      driver: bus.driver,
      capacity: bus.capacity
    })
  }

  const handleEditRoute = (route) => {
    setEditingRoute(route.id)
    setEditFormData({
      name: route.name,
      start: route.start,
      end: route.end,
      distance: route.distance,
      duration: route.duration,
      status: route.status
    })
  }

  const handleSaveEdit = async () => {
    try {
      if (editingBus) {
        // Mock API call - in real app: await adminAPI.updateBus(editingBus, editFormData)
        console.log('Updating bus:', editingBus, editFormData)
        // Update local state
        setBuses(prev => prev.map(bus =>
          bus.id === editingBus ? { ...bus, ...editFormData } : bus
        ))
      } else if (editingRoute) {
        // Mock API call - in real app: await adminAPI.updateRoute(editingRoute, editFormData)
        console.log('Updating route:', editingRoute, editFormData)
        // Update local state
        setRoutes(prev => prev.map(route =>
          route.id === editingRoute ? { ...route, ...editFormData } : route
        ))
      }

      // Reset editing state
      setEditingBus(null)
      setEditingRoute(null)
      setEditFormData({})

      // Show success message
      alert('Item updated successfully!')
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update item. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setEditingBus(null)
    setEditingRoute(null)
    setEditFormData({})
  }

  const handleDeleteBus = (bus) => {
    setDeleteConfirm({ type: 'bus', item: bus })
  }

  const handleDeleteRoute = (route) => {
    setDeleteConfirm({ type: 'route', item: route })
  }

  const confirmDelete = async () => {
    try {
      const { type, item } = deleteConfirm

      if (type === 'bus') {
        // Mock API call - in real app: await adminAPI.deleteBus(item.id)
        console.log('Deleting bus:', item.id)
        // Remove from local state
        setBuses(prev => prev.filter(bus => bus.id !== item.id))
      } else if (type === 'route') {
        // Mock API call - in real app: await adminAPI.deleteRoute(item.id)
        console.log('Deleting route:', item.id)
        // Remove from local state
        setRoutes(prev => prev.filter(route => route.id !== item.id))
      }

      setDeleteConfirm({ type: null, item: null })
      alert(`${type === 'bus' ? 'Bus' : 'Route'} deleted successfully!`)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  // Mock data - in real app this would come from API
  const [stats] = useState({
    totalBuses: 156,
    activeRoutes: 42,
    driversOnline: 89,
    totalUsers: 5432,
    dailyBookings: 1247,
    ticketSales: 245000,
    alerts: 3,
    totalBookings: 15678
  })

  const [buses, setBuses] = useState([
    { id: 1, number: 'BR-502', name: 'Bihar Express', route: 'Patna-Gaya', status: 'active', gps: 'online', driver: 'Rajesh Kumar', capacity: 50, lastMaintenance: '2024-01-15' },
    { id: 2, number: 'BR-305', name: 'Bihar Deluxe', route: 'Muzaffarpur-Patna', status: 'active', gps: 'online', driver: 'Amit Singh', capacity: 45, lastMaintenance: '2024-01-10' },
    { id: 3, number: 'BR-401', name: 'Bihar State', route: 'Gaya-Bhagalpur', status: 'offline', gps: 'offline', driver: 'Suresh Yadav', capacity: 48, lastMaintenance: '2024-01-08' },
    { id: 4, number: 'BR-208', name: 'Bihar Express', route: 'Darbhanga-Patna', status: 'maintenance', gps: 'offline', driver: 'Mohan Das', capacity: 52, lastMaintenance: '2024-01-12' },
    { id: 5, number: 'BR-601', name: 'Bihar Deluxe', route: 'Patna-Muzaffarpur', status: 'active', gps: 'online', driver: 'Vikash Kumar', capacity: 46, lastMaintenance: '2024-01-14' },
  ])

  const [routes, setRoutes] = useState([
    { id: 1, name: 'Patna-Gaya', start: 'Patna Junction', end: 'Gaya Bus Stand', stops: 8, distance: 92, duration: 120, status: 'active', buses: 5 },
    { id: 2, name: 'Muzaffarpur-Patna', start: 'Muzaffarpur Bus Stand', end: 'Patna Junction', stops: 12, distance: 85, duration: 110, status: 'active', buses: 4 },
    { id: 3, name: 'Gaya-Bhagalpur', start: 'Gaya Bus Stand', end: 'Bhagalpur Station', stops: 15, distance: 180, duration: 180, status: 'active', buses: 3 },
    { id: 4, name: 'Darbhanga-Patna', start: 'Darbhanga Bus Stand', end: 'Patna Junction', stops: 10, distance: 150, duration: 160, status: 'inactive', buses: 2 },
  ])

  const [users] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '9876543210', role: 'user', status: 'active', joinDate: '2024-01-15', bookings: 12 },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', role: 'user', status: 'active', joinDate: '2024-01-10', bookings: 8 },
    { id: 3, name: 'Amit Yadav', email: 'amit@example.com', phone: '9876543212', role: 'driver', status: 'active', joinDate: '2024-01-08', bookings: 0 },
    { id: 4, name: 'Sneha Sharma', email: 'sneha@example.com', phone: '9876543213', role: 'user', status: 'suspended', joinDate: '2024-01-05', bookings: 3 },
  ])

  const [bookings] = useState([
    { id: 1, bookingId: 'BBS-2024-001234', user: 'Rahul Kumar', route: 'Patna-Gaya', bus: 'BR-502', date: '2024-01-20', time: '06:00 AM', seats: ['5A', '5B'], amount: 500, status: 'confirmed' },
    { id: 2, bookingId: 'BBS-2024-001235', user: 'Priya Singh', route: 'Muzaffarpur-Patna', bus: 'BR-305', date: '2024-01-21', time: '08:30 AM', seats: ['3C'], amount: 180, status: 'pending' },
    { id: 3, bookingId: 'BBS-2024-001236', user: 'Rahul Kumar', route: 'Gaya-Bhagalpur', bus: 'BR-401', date: '2024-01-19', time: '07:00 AM', seats: ['7A', '7B', '7C'], amount: 960, status: 'confirmed' },
  ])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const filteredBuses = buses.filter(bus =>
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(bus => selectedStatus === 'all' || bus.status === selectedStatus)

  const getStatusColor = (status, type = 'bus') => {
    const colors = {
      active: type === 'bus' ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-800',
      offline: 'bg-gray-700 text-gray-400',
      maintenance: 'bg-yellow-900 text-yellow-400',
      inactive: 'bg-red-900 text-red-400',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-700 text-gray-400'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />
      case 'offline': return <XCircle size={16} />
      case 'maintenance': return <Wrench size={16} />
      default: return <XCircle size={16} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Admin Control Panel" />

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Buses', value: stats.totalBuses, icon: Bus, color: 'text-blue-400' },
                { label: 'Active Routes', value: stats.activeRoutes, icon: Route, color: 'text-green-400' },
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-400' },
                { label: 'Daily Bookings', value: stats.dailyBookings, icon: Ticket, color: 'text-yellow-400' },
                { label: 'Drivers Online', value: stats.driversOnline, icon: Activity, color: 'text-emerald-400' },
                { label: 'Ticket Sales', value: `₹${stats.ticketSales.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
                { label: 'Total Bookings', value: stats.totalBookings, icon: BarChart3, color: 'text-orange-400' },
                { label: 'Active Alerts', value: stats.alerts, icon: AlertTriangle, color: 'text-red-400' },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={stat.color} size={24} />
                      {stat.label === 'Active Alerts' && stat.value > 0 && (
                        <span className="text-xs bg-red-900 text-red-400 px-2 py-1 rounded-full">
                          {stat.value}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Revenue Trend</h3>
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {[45, 65, 80, 55, 90, 75, 85].map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg mb-2"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-400">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Activity</h3>
                  <Activity className="text-blue-400" size={20} />
                </div>
                <div className="space-y-3">
                  {[
                    { time: '2 mins ago', action: 'New booking confirmed', user: 'Rahul Kumar' },
                    { time: '5 mins ago', action: 'Bus BR-502 went offline', user: 'System' },
                    { time: '12 mins ago', action: 'New route added', user: 'Admin' },
                    { time: '1 hour ago', action: 'Payment processed', user: 'Priya Singh' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-400">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            {/* Header with Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search buses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <button
                  onClick={() => navigate('/admin/add-bus')}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Bus</span>
                </button>
              </div>
            </div>

            {/* Buses List */}
            <div className="grid gap-4">
              {filteredBuses.map((bus) => (
                <div key={bus.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Bus size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{bus.name}</h3>
                        <p className="text-gray-400">{bus.number} • {bus.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(bus.status)}`}>
                        {getStatusIcon(bus.status)}
                        <span className="capitalize">{bus.status}</span>
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditBus(bus)}
                          className="p-2 hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit Bus"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus)}
                          className="p-2 hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete Bus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {editingBus === bus.id ? (
                    <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                      <h4 className="font-semibold text-white">Edit Bus</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          placeholder="Bus Name"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="text"
                          value={editFormData.number || ''}
                          onChange={(e) => setEditFormData({...editFormData, number: e.target.value})}
                          placeholder="Bus Number"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <select
                          value={editFormData.status || ''}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="offline">Offline</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        <input
                          type="number"
                          value={editFormData.capacity || ''}
                          onChange={(e) => setEditFormData({...editFormData, capacity: e.target.value})}
                          placeholder="Capacity"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Driver</p>
                        <p className="font-medium">{bus.driver}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Capacity</p>
                        <p className="font-medium">{bus.capacity} seats</p>
                      </div>
                      <div>
                        <p className="text-gray-400">GPS Status</p>
                        <div className="flex items-center space-x-1">
                          <Radio size={14} className={bus.gps === 'online' ? 'text-green-400' : 'text-red-400'} />
                          <span className={bus.gps === 'online' ? 'text-green-400' : 'text-red-400'}>
                            {bus.gps}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Maintenance</p>
                        <p className="font-medium">{bus.lastMaintenance}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Route Management</h2>
              <button
                onClick={() => navigate('/admin/add-route')}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                <span>Add Route</span>
              </button>
            </div>

            <div className="grid gap-4">
              {routes.map((route) => (
                <div key={route.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center">
                        <Route size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{route.name}</h3>
                        <p className="text-gray-400">{route.start} → {route.end}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditRoute(route)}
                          className="p-2 hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit Route"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route)}
                          className="p-2 hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete Route"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {editingRoute === route.id ? (
                    <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                      <h4 className="font-semibold text-white">Edit Route</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          placeholder="Route Name"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="text"
                          value={editFormData.start || ''}
                          onChange={(e) => setEditFormData({...editFormData, start: e.target.value})}
                          placeholder="Start Point"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="text"
                          value={editFormData.end || ''}
                          onChange={(e) => setEditFormData({...editFormData, end: e.target.value})}
                          placeholder="End Point"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="number"
                          value={editFormData.distance || ''}
                          onChange={(e) => setEditFormData({...editFormData, distance: e.target.value})}
                          placeholder="Distance (km)"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={editFormData.duration || ''}
                          onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                          placeholder="Duration (minutes)"
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <select
                          value={editFormData.status || ''}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Stops</p>
                        <p className="font-medium">{route.stops} stops</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Distance</p>
                        <p className="font-medium">{route.distance} km</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="font-medium">{Math.floor(route.duration / 60)}h {route.duration % 60}m</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Active Buses</p>
                        <p className="font-medium">{route.buses} buses</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500">
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="driver">Drivers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Users size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin' ? 'bg-purple-900 text-purple-400' : user.role === 'driver' ? 'bg-blue-900 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Join Date</p>
                      <p className="font-medium">{user.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Bookings</p>
                      <p className="font-medium">{user.bookings}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-900 hover:bg-blue-800 rounded text-sm transition-colors">
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      {user.status === 'active' ? (
                        <button className="flex items-center space-x-1 px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-sm transition-colors">
                          <Ban size={14} />
                          <span>Suspend</span>
                        </button>
                      ) : (
                        <button className="flex items-center space-x-1 px-3 py-1 bg-green-900 hover:bg-green-800 rounded text-sm transition-colors">
                          <UserCheck size={14} />
                          <span>Activate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500">
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{booking.bookingId}</h3>
                      <p className="text-gray-400">{booking.user}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-xl font-bold text-green-400 mt-1">₹{booking.amount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Route</p>
                      <p className="font-medium">{booking.route}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Bus</p>
                      <p className="font-medium">{booking.bus}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date & Time</p>
                      <p className="font-medium">{booking.date} at {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Seats</p>
                      <p className="font-medium">{booking.seats.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">System Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">System Name</label>
                    <input
                      type="text"
                      defaultValue="Bihar Bus Service"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@biharbus.com"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Support Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91-1234567890"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Razorpay Key ID</label>
                    <input
                      type="text"
                      defaultValue="rzp_test_****************"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Convenience Fee (%)</label>
                    <input
                      type="number"
                      defaultValue="2.5"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="wallet" defaultChecked className="rounded" />
                    <label htmlFor="wallet" className="text-sm">Enable Wallet Payments</label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              {/* System Maintenance */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">System Maintenance</h3>
                <div className="space-y-4">
                  <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Clear Cache
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Backup Database
                  </button>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Reset System
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Save All Settings
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.item && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this {deleteConfirm.type}?
                  <br />
                  <strong className="text-gray-800">
                    {deleteConfirm.type === 'bus'
                      ? `${deleteConfirm.item.name} (${deleteConfirm.item.number})`
                      : deleteConfirm.item.name
                    }
                  </strong>
                </p>
                <p className="text-sm text-red-600 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDeleteConfirm({ type: null, item: null })}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
