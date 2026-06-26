import { useState, useEffect } from 'react'
import { X, CreditCard, CheckCircle } from 'lucide-react'
import { paymentAPI } from '../services/api'

export default function AddMoneyModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('amount') // 'amount' | 'payment' | 'processing' | 'success'
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [progress, setProgress] = useState(0)

  const quickAmounts = [100, 200, 500, 1000, 2000]

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString())
  }

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    setStep('payment')
  }

  const handlePayment = async () => {
    setLoading(true)
    setStep('processing')
    setProgress(0)

    try {
      // Simulate payment processing with progress updates
      const progressSteps = [10, 25, 45, 65, 85, 95, 100]
      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300 + (i * 100)))
        setProgress(progressSteps[i])
      }

      // Final processing delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Call the API to add money
      const response = await paymentAPI.addMoneyToWallet(parseFloat(amount))

      if (response.data.success) {
        setPaymentDetails({
          transactionId: response.data.transactionId,
          amount: response.data.amount,
          newBalance: response.data.newBalance
        })
        setStep('success')
        setShowToast(true)
        onSuccess(response.data.newBalance)

        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
      setStep('payment')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setAmount('')
    setStep('amount')
    setPaymentDetails(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 'amount' && 'Add Money to Wallet'}
            {step === 'payment' && 'Confirm Payment'}
            {step === 'success' && 'Payment Successful'}
          </h2>
          {step !== 'success' && (
            <button
              onClick={resetModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'amount' && (
            <div className="space-y-6">
              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Add Amount
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                        amount === amt.toString()
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Proceed to Pay ₹{amount || '0'}
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount to Add</span>
                    <span className="font-semibold">₹{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span className="font-semibold text-green-600">₹0</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Demo Payment Gateway</p>
                    <p className="text-sm text-gray-600">Instant transfer to wallet</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{amount}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay ₹${amount}`
                )}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-8 animate-in fade-in-0 duration-500">
              {/* Processing Animation */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-spin">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Rotating border effect */}
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
              </div>

              {/* Processing Message */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 animate-pulse">
                  Processing Payment...
                </h3>
                <p className="text-gray-600">
                  Please wait while we securely process your ₹{amount} payment
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Initializing...</span>
                  <span>{progress}% Complete</span>
                </div>

                {/* Processing Steps */}
                <div className="space-y-2 text-left">
                  {[
                    { step: 'Validating Payment', completed: progress >= 25 },
                    { step: 'Processing Transaction', completed: progress >= 65 },
                    { step: 'Confirming Payment', completed: progress >= 95 },
                    { step: 'Adding to Wallet', completed: progress >= 100 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${item.completed ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className={`text-sm ${item.completed ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                        {item.step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🔒 Secure Payment Processing</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Your payment is protected by bank-level security
                </p>
              </div>
            </div>
          )}

          {step === 'success' && paymentDetails && (
            <div className="text-center space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
              {/* Enhanced Success Animation Container */}
              <div className="relative">
                {/* Main success circle with pulse */}
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce relative z-10">
                  <CheckCircle className="text-white animate-pulse" size={48} />
                </div>

                {/* Pulsing rings */}
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-green-300 animate-ping opacity-50 animation-delay-300"></div>

                {/* Advanced confetti effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Colorful confetti particles */}
                  <div className="absolute top-0 left-6 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute top-4 right-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-100 opacity-90"></div>
                  <div className="absolute bottom-2 left-12 w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce animation-delay-200 opacity-85"></div>
                  <div className="absolute bottom-4 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce animation-delay-300 opacity-80"></div>
                  <div className="absolute top-8 left-2 w-2 h-2 bg-red-400 rounded-full animate-bounce animation-delay-400 opacity-75"></div>
                  <div className="absolute bottom-8 right-2 w-1 h-1 bg-indigo-400 rounded-full animate-bounce animation-delay-500 opacity-70"></div>

                  {/* Floating particles */}
                  <div className="absolute top-12 left-4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60"></div>
                  <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping animation-delay-200 opacity-65"></div>
                  <div className="absolute bottom-12 left-8 w-1 h-1 bg-teal-400 rounded-full animate-ping animation-delay-400 opacity-55"></div>
                  <div className="absolute bottom-16 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-600 opacity-60"></div>
                </div>

                {/* Success wave effect */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
              </div>

              {/* Enhanced Success Message */}
              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 shadow-lg animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-4xl animate-bounce">🎉</span>
                  <span className="text-4xl animate-bounce animation-delay-100">✨</span>
                  <span className="text-4xl animate-bounce animation-delay-200">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-3 animate-pulse">
                  Payment Successful!
                </h3>
                <p className="text-green-700 font-medium text-lg">
                  ₹{paymentDetails.amount} has been added to your wallet instantly
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-sm text-green-600 font-medium">
                    ✅ Transaction completed securely
                  </span>
                </div>

                {/* Success metrics */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white bg-opacity-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-700">⚡</div>
                    <div className="text-xs text-green-600">Instant</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-700">🔒</div>
                    <div className="text-xs text-green-600">Secure</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-700">💳</div>
                    <div className="text-xs text-green-600">Verified</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Transaction Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-lg animate-in slide-in-from-bottom-4 duration-1000 animation-delay-300">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg">Transaction Details</h4>
                </div>

                <div className="space-y-4">
                  {/* Amount Added */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 animate-in slide-in-from-left-2 duration-500 animation-delay-500">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">₹</span>
                        </div>
                        <span className="text-gray-700 font-medium">Amount Added</span>
                      </div>
                      <span className="font-bold text-green-600 text-xl animate-pulse">₹{paymentDetails.amount}</span>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-in slide-in-from-left-2 duration-500 animation-delay-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">#</span>
                        </div>
                        <span className="text-gray-700 font-medium">Transaction ID</span>
                      </div>
                      <span className="font-mono text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium">
                        {paymentDetails.transactionId}
                      </span>
                    </div>
                  </div>

                  {/* New Balance */}
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-200 animate-in slide-in-from-left-2 duration-500 animation-delay-900">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-bold text-sm">💰</span>
                        </div>
                        <span className="text-gray-700 font-medium">New Wallet Balance</span>
                      </div>
                      <span className="font-bold text-primary-600 text-xl animate-pulse">₹{paymentDetails.newBalance}</span>
                    </div>
                  </div>
                </div>

                {/* Success indicators */}
                <div className="flex justify-center space-x-4 pt-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <span className="text-sm font-medium">Instant</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={resetModal}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue Shopping 🎯
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <CheckCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-bold">Payment Successful!</p>
              <p className="text-sm opacity-90">₹{paymentDetails?.amount} added to your wallet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
