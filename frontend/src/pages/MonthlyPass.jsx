import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Star, Crown, Zap, Calendar, IndianRupee, LogIn } from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'
import PaymentModal from '../components/PaymentModal'
import { useNotification } from '../contexts/NotificationContext'

export default function MonthlyPass() {
  const navigate = useNavigate()
  const { success, error, info } = useNotification()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [purchasedPlan, setPurchasedPlan] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLoginRedirect = () => {
    // Store current location for redirect after login
    localStorage.setItem('redirectAfterLogin', '/monthly-pass')
    navigate('/login')
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic Pass',
      price: 1200,
      originalPrice: 1800,
      savings: '33%',
      period: '30 days',
      color: 'from-blue-500 to-blue-600',
      icon: Calendar,
      features: [
        'Unlimited rides within city',
        'Valid for 30 days',
        'Digital pass',
        '24/7 customer support'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Pass',
      price: 1800,
      originalPrice: 2400,
      savings: '25%',
      period: '30 days',
      color: 'from-purple-500 to-purple-600',
      icon: Star,
      features: [
        'Unlimited rides within city',
        'Express lane access',
        'Priority booking',
        'Travel insurance included',
        'Free cancellation',
        '24/7 premium support'
      ],
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP Pass',
      price: 2500,
      originalPrice: 3500,
      savings: '29%',
      period: '30 days',
      color: 'from-yellow-500 to-orange-600',
      icon: Crown,
      features: [
        'Unlimited rides within state',
        'VIP lounge access',
        'Personal driver option',
        'Premium insurance',
        'Concierge service',
        'Exclusive events access',
        '24/7 dedicated support'
      ],
      popular: false
    }
  ]

  const handlePlanSelect = (planId) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setSelectedPlan(planId)
    setShowPaymentModal(true)
    info('Payment Method Selected', `You've selected the ${plans.find(p => p.id === planId)?.name}. Proceed to payment.`)
  }

  const handlePaymentSuccess = (plan) => {
    setPurchasedPlan(plan)
    setSelectedPlan(null)
    success('Payment Successful!', `Your ${plan.name} has been activated successfully. Enjoy your travel!`)
    console.log(`Payment successful for plan: ${plan.name}`)
  }

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Monthly Pass" />

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl p-6 mb-6">
            <Zap className="mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-bold mb-2">Monthly Subscription Pass</h1>
            <p className="text-lg text-primary-100">
              Save up to 30% on your daily commute
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <IndianRupee size={20} />
              <span className="text-2xl font-bold">1,200</span>
              <span className="text-sm line-through text-primary-200">₹1,800</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                33% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary-600">50+</div>
            <div className="text-sm text-gray-600">Routes Covered</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-secondary-600">10K+</div>
            <div className="text-sm text-gray-600">Happy Users</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">30%</div>
            <div className="text-sm text-gray-600">Max Savings</div>
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary-500 scale-105' : 'hover:scale-102'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon size={32} />
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm opacity-90">{plan.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <IndianRupee size={20} />
                        <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm line-through opacity-75">
                          ₹{plan.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {plan.savings} OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Check size={16} className="text-green-300" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <button
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${
                      isSelected
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlanSelect(plan.id)
                    }}
                  >
                    {isSelected ? 'Pay Now' : 'Select Plan'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Why Choose Monthly Pass?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <IndianRupee className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Save Money</h3>
                <p className="text-gray-600 text-sm">
                  Pay once and travel unlimited. Save up to 30% compared to daily fares.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-secondary-100 p-3 rounded-full">
                <Calendar className="text-secondary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Convenient</h3>
                <p className="text-gray-600 text-sm">
                  No need to carry cash. Just tap and ride with your digital pass.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Zap className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Fast & Easy</h3>
                <p className="text-gray-600 text-sm">
                  Skip the queues with express lane access and priority booking.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Check className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Flexible</h3>
                <p className="text-gray-600 text-sm">
                  Use any time, any route within your plan limits. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {purchasedPlan && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
            <Check className="mx-auto mb-4 text-green-600" size={48} />
            <h3 className="text-xl font-bold text-green-800 mb-2">Purchase Successful!</h3>
            <p className="text-green-700 mb-4">
              Your {purchasedPlan.name} has been activated and is ready to use.
            </p>
            <div className="bg-white rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">
                Valid until: <span className="font-semibold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Save on Your Commute?</h3>
            <p className="text-primary-100 mb-4">
              Complete your purchase and start saving today!
            </p>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Purchase Now - ₹{plans.find(p => p.id === selectedPlan)?.price?.toLocaleString()}
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <LogIn size={48} className="mx-auto mb-4 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to purchase a monthly pass. Please sign in to continue with your purchase.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
              >
                Login to Continue
              </button>
              <button
                onClick={handleLoginPromptClose}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPlan={plans.find(p => p.id === selectedPlan)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
