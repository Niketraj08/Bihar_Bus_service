import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Globe,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function UserSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [settings, setSettings] = useState({
    // Profile Settings
    name: '',
    email: '',
    phone: '',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    bookingReminders: true,
    promotionalOffers: false,

    // Privacy Settings
    profileVisibility: 'private',
    showWalletBalance: true,

    // App Settings
    theme: 'light',
    language: 'en',
    currency: 'INR',

    // Password Change
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setSettings(prev => ({
          ...prev,
          name: parsedUser.name,
          email: parsedUser.email,
          phone: parsedUser.phone
        }))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleToggleChange = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validate inputs
      if (!settings.name.trim()) {
        throw new Error('Name is required')
      }
      if (!settings.email.trim()) {
        throw new Error('Email is required')
      }
      if (!settings.phone.trim()) {
        throw new Error('Phone number is required')
      }

      // In a real app, this would call the API
      // await userAPI.updateProfile(settings)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local storage
      const updatedUser = { ...user, name: settings.name, email: settings.email, phone: settings.phone }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess('Profile updated successfully!')
    } catch (error) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!settings.currentPassword) {
        throw new Error('Current password is required')
      }
      if (!settings.newPassword) {
        throw new Error('New password is required')
      }
      if (settings.newPassword !== settings.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (settings.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // In a real app, this would call the API
      // await authAPI.changePassword(settings.currentPassword, settings.newPassword)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clear password fields
      setSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

      setSuccess('Password changed successfully!')
    } catch (error) {
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // In a real app, this would call the API
      // await userAPI.updateNotificationSettings(settings)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess('Notification preferences saved!')
    } catch (error) {
      setError('Failed to save notification settings')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Settings" />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Profile Settings</h3>
                  <p className="text-blue-100 text-sm">Update your personal information</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-600 capitalize">{user.role}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      user.role === 'admin' ? 'bg-red-500' :
                      user.role === 'driver' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Change Password</h3>
                  <p className="text-purple-100 text-sm">Update your account password</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={settings.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Shield size={18} />
                  )}
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Bell className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Notification Preferences</h3>
                  <p className="text-green-100 text-sm">Choose how you want to be notified</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleToggleChange('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Get important updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={() => handleToggleChange('smsNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={() => handleToggleChange('pushNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Booking Reminders</h4>
                    <p className="text-sm text-gray-600">Get reminded about upcoming journeys</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.bookingReminders}
                      onChange={() => handleToggleChange('bookingReminders')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Promotional Offers</h4>
                    <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.promotionalOffers}
                      onChange={() => handleToggleChange('promotionalOffers')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Bell size={18} />
                  )}
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Globe className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">App Preferences</h3>
                  <p className="text-orange-100 text-sm">Customize your app experience</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Show Wallet Balance</h4>
                  <p className="text-sm text-gray-600">Display your wallet balance in the app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showWalletBalance}
                    onChange={() => handleToggleChange('showWalletBalance')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
