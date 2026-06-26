import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, MapPin, Users, Ticket, TrendingUp, AlertTriangle, Settings, Route, CreditCard, BarChart3 } from 'lucide-react'
import Header from '../components/Header'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats] = useState({
    totalBuses: 156,
    activeRoutes: 42,
    driversOnline: 89,
    dailyBookings: 1247,
    ticketSales: 245000,
    alerts: 3
  })

  const recentAlerts = [
    { id: 1, bus: 'BR-502', route: 'Patna-Gaya', issue: 'Delay: 15 minutes', severity: 'medium' },
    { id: 2, bus: 'BR-305', route: 'Muzaffarpur-Patna', issue: 'GPS offline', severity: 'high' },
    { id: 3, bus: 'BR-401', route: 'Gaya-Bhagalpur', issue: 'Maintenance due', severity: 'low' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Admin Dashboard" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Control Panel Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">🎛️ Admin Control Panel</h2>
              <p className="text-primary-100 text-sm">Complete control over buses, routes, users, and bookings</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Open Control Panel
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Bus className="text-primary-400" size={24} />
              <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">+5</span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Buses</p>
            <p className="text-2xl font-bold">{stats.totalBuses}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Route className="text-secondary-400" size={24} />
              <span className="text-xs text-blue-400 bg-blue-900 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Active Routes</p>
            <p className="text-2xl font-bold">{stats.activeRoutes}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-green-400" size={24} />
              <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">Online</span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Drivers Online</p>
            <p className="text-2xl font-bold">{stats.driversOnline}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <Ticket className="text-yellow-400 mb-2" size={24} />
            <p className="text-sm text-gray-400 mb-1">Daily Bookings</p>
            <p className="text-2xl font-bold">{stats.dailyBookings}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <TrendingUp className="text-emerald-400 mb-2" size={24} />
            <p className="text-sm text-gray-400 mb-1">Ticket Sales</p>
            <p className="text-2xl font-bold">₹{stats.ticketSales.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-red-400" size={24} />
              {stats.alerts > 0 && (
                <span className="text-xs text-red-400 bg-red-900 px-2 py-1 rounded-full">
                  {stats.alerts}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-1">Alerts</p>
            <p className="text-2xl font-bold">{stats.alerts}</p>
          </div>
        </div>

        {/* Revenue Analytics Dashboard */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Revenue Analytics</h3>
              <p className="text-gray-400 text-sm">Comprehensive revenue performance analysis</p>
            </div>
            <div className="flex items-center space-x-2">
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-primary-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last Year</option>
              </select>
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Total Revenue</span>
                <span className="text-green-400 text-sm">+12.5%</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{stats.ticketSales.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">vs last period</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Avg. Ticket Price</span>
                <span className="text-blue-400 text-sm">+5.2%</span>
              </div>
              <p className="text-2xl font-bold text-white">₹{Math.round(stats.ticketSales / stats.dailyBookings)}</p>
              <p className="text-xs text-gray-400 mt-1">per booking</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Booking Rate</span>
                <span className="text-purple-400 text-sm">+8.1%</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.dailyBookings}</p>
              <p className="text-xs text-gray-400 mt-1">bookings today</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Growth Rate</span>
                <span className="text-emerald-400 text-sm">+15.3%</span>
              </div>
              <p className="text-2xl font-bold text-white">+23%</p>
              <p className="text-xs text-gray-400 mt-1">monthly growth</p>
            </div>
          </div>

          {/* Enhanced Revenue Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-white">Revenue Trend (Last 7 Days)</h4>
            <div className="h-64 bg-gray-900 rounded-lg p-4">
              {/* Chart Area */}
              <div className="relative h-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-12">
                  <span>₹300k</span>
                  <span>₹225k</span>
                  <span>₹150k</span>
                  <span>₹75k</span>
                  <span>₹0</span>
                </div>

                {/* Chart bars */}
                <div className="ml-14 h-full flex items-end justify-between space-x-2">
                  {[
                    { day: 'Mon', revenue: 185000, bookings: 145, growth: 8.5 },
                    { day: 'Tue', revenue: 245000, bookings: 189, growth: 12.3 },
                    { day: 'Wed', revenue: 168000, bookings: 132, growth: -5.2 },
                    { day: 'Thu', revenue: 298000, bookings: 245, growth: 18.7 },
                    { day: 'Fri', revenue: 234000, bookings: 178, growth: 7.8 },
                    { day: 'Sat', revenue: 267000, bookings: 203, growth: 14.1 },
                    { day: 'Sun', revenue: 312000, bookings: 267, growth: 16.9 }
                  ].map((data, idx) => {
                    const maxRevenue = 312000;
                    const height = (data.revenue / maxRevenue) * 100;
                    const growthColor = data.growth > 0 ? 'text-green-400' : 'text-red-400';

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          <div className="font-semibold">₹{data.revenue.toLocaleString()}</div>
                          <div>{data.bookings} bookings</div>
                          <div className={growthColor}>{data.growth > 0 ? '+' : ''}{data.growth}%</div>
                        </div>

                        {/* Bar */}
                        <div className="relative w-full max-w-8">
                          <div
                            className={`w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-500 hover:to-primary-300 cursor-pointer ${
                              data.growth > 0 ? 'shadow-lg shadow-primary-500/30' : ''
                            }`}
                            style={{ height: `${height}%` }}
                          ></div>

                          {/* Growth indicator */}
                          <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
                            data.growth > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {data.growth > 0 ? '↗' : '↘'}
                          </div>
                        </div>

                        {/* Day label */}
                        <span className="text-xs text-gray-400 mt-2 font-medium">{data.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Routes */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-semibold mb-3 text-white flex items-center">
                <MapPin className="text-blue-400 mr-2" size={16} />
                Top Routes
              </h4>
              <div className="space-y-2">
                {[
                  { route: 'Patna-Gaya', revenue: '₹85,000', percentage: 28 },
                  { route: 'Muzaffarpur-Patna', revenue: '₹72,000', percentage: 24 },
                  { route: 'Gaya-Bhagalpur', revenue: '₹65,000', percentage: 21 },
                  { route: 'Darbhanga-Patna', revenue: '₹58,000', percentage: 19 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-300">{item.route}</span>
                        <span className="text-xs text-gray-400">{item.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-semibold mb-3 text-white flex items-center">
                <CreditCard className="text-green-400 mr-2" size={16} />
                Payment Methods
              </h4>
              <div className="space-y-3">
                {[
                  { method: 'Wallet', amount: '₹142,000', percentage: 47, color: 'bg-green-500' },
                  { method: 'UPI', amount: '₹89,000', percentage: 29, color: 'bg-blue-500' },
                  { method: 'Card', amount: '₹56,000', percentage: 18, color: 'bg-purple-500' },
                  { method: 'Cash', amount: '₹23,000', percentage: 8, color: 'bg-yellow-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.method}</span>
                        <span className="text-gray-400">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-semibold mb-3 text-white flex items-center">
                <BarChart3 className="text-orange-400 mr-2" size={16} />
                Insights
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-900/20 rounded">
                  <span className="text-sm text-green-400">Peak Day</span>
                  <span className="text-sm font-bold text-white">Sunday</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded">
                  <span className="text-sm text-blue-400">Best Route</span>
                  <span className="text-sm font-bold text-white">Patna-Gaya</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
                  <span className="text-sm text-purple-400">Top Payment</span>
                  <span className="text-sm font-bold text-white">Wallet</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-900/20 rounded">
                  <span className="text-sm text-red-400">Lowest Day</span>
                  <span className="text-sm font-bold text-white">Wednesday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <AlertTriangle className="text-red-400" size={20} />
              <span>Recent Alerts</span>
            </h3>
            {stats.alerts > 0 && (
              <span className="bg-red-900 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {stats.alerts} Active
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'high'
                    ? 'bg-red-900/20 border-red-700'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-900/20 border-yellow-700'
                    : 'bg-blue-900/20 border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{alert.bus}</p>
                    <p className="text-sm text-gray-400">{alert.route}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'high'
                        ? 'bg-red-700 text-red-200'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-700 text-yellow-200'
                        : 'bg-blue-700 text-blue-200'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{alert.issue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 border border-primary-600 rounded-xl p-4 flex flex-col items-center space-y-2 transition-all transform hover:scale-105"
          >
            <Settings className="text-white" size={32} />
            <span className="font-semibold text-white">Full Control Panel</span>
            <span className="text-xs text-primary-100">Complete admin control</span>
          </button>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => navigate('/admin/buses')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 flex items-center space-x-3 transition-colors"
            >
              <Bus className="text-primary-400" size={20} />
              <span className="font-semibold">Bus Management</span>
            </button>

            <button
              onClick={() => navigate('/admin/routes')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 flex items-center space-x-3 transition-colors"
            >
              <Route className="text-secondary-400" size={20} />
              <span className="font-semibold">Route Management</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

