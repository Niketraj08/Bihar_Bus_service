import { useState } from 'react'
import { X, CreditCard, Smartphone, Building, Wallet, CheckCircle, Loader } from 'lucide-react'
import { useNotification } from '../contexts/NotificationContext'

export default function PaymentModal({ isOpen, onClose, selectedPlan, onPaymentSuccess }) {
  const { info, success } = useNotification()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      color: 'bg-blue-500'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Paytm, Google Pay, PhonePe, BHIM UPI',
      color: 'bg-purple-500'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks',
      color: 'bg-green-500'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Mobikwik, Ola Money',
      color: 'bg-orange-500'
    }
  ]

  const handlePayment = async () => {
    if (!paymentMethod) return

    setIsProcessing(true)
    info('Processing Payment', 'Please wait while we process your payment securely...')

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
      success('Payment Completed!', 'Your payment has been processed successfully.')

      // Show success animation for 3 seconds then close
      setTimeout(() => {
        setShowSuccess(false)
        onPaymentSuccess(selectedPlan)
        onClose()
      }, 3000)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{selectedPlan?.name}</h3>
                <p className="text-sm opacity-90">{selectedPlan?.period}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{selectedPlan?.price?.toLocaleString()}</div>
                <div className="text-sm line-through opacity-75">₹{selectedPlan?.originalPrice?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Success Animation */}
          {showSuccess && (
            <div className="text-center py-8">
              <div className="mb-4">
                <CheckCircle
                  size={64}
                  className="text-green-500 mx-auto animate-bounce"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your {selectedPlan?.name} has been activated successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  You will receive a confirmation email with your pass details.
                </p>
              </div>
            </div>
          )}

          {/* Payment Processing */}
          {isProcessing && !showSuccess && (
            <div className="text-center py-8">
              <div className="mb-4">
                <Loader size={48} className="text-primary-600 mx-auto animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment...</h3>
              <p className="text-gray-600">
                Please wait while we process your payment securely.
              </p>
            </div>
          )}

          {/* Payment Methods */}
          {!isProcessing && !showSuccess && (
            <>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Choose Payment Method</h3>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${method.color} text-white`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle size={20} className="text-primary-600" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={!paymentMethod}
                className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
                  paymentMethod
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Pay ₹{selectedPlan?.price?.toLocaleString()}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
