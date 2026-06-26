import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Star } from 'lucide-react'
import Header from '../components/Header'
import { authAPI } from '../services/api'
import { useNotification } from '../contexts/NotificationContext'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { info } = useNotification()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // No longer need phone number pre-filling since we removed phone auth

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
            <p className="text-gray-600 text-center mb-6">Sign up to get started</p>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center space-x-2">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-green-700 font-medium">Account created successfully!</p>
                  <p className="text-green-600 text-sm">Redirecting you to your dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center space-x-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!success && (
              <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`input-field pl-10 ${
                        formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 focus:border-red-500'
                          : ''
                      }`}
                      required
                    />
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      Passwords do not match
                    </p>
                  )}
                  {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                    <p className="text-green-500 text-xs mt-1 flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      Passwords match
                    </p>
                  )}
                </div>

              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Account Created!</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Google Sign Up */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <button className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Sign up with Google</span>
                </button>
              </div>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
            )}


            {/* Success Screen */}
            {success && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="text-white" size={40} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Bihar Bus Service! 🎉</h3>
                  <p className="text-gray-600">Your account has been created successfully. Redirecting you to your dashboard...</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>✅ Complete your profile</li>
                    <li>✅ Add money to your wallet</li>
                    <li>✅ Book your first bus ticket</li>
                    <li>✅ Enjoy hassle-free travel!</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

