import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User, CreditCard, ArrowRight } from 'lucide-react'
import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

export default function SeatSelection() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bus, searchData } = location.state || {}
  
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  })

  // Simulated seat layout (2x2 configuration)
  const generateSeats = () => {
    const seats = []
    const rows = 10
    const seatsPerRow = 4
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seat)}`
        const isBooked = Math.random() > 0.7 // 30% booked
        rowSeats.push({
          number: seatNumber,
          booked: isBooked,
          selected: selectedSeats.includes(seatNumber)
        })
      }
      seats.push(rowSeats)
    }
    return seats
  }

  const [seats] = useState(generateSeats())

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber))
    } else {
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  const totalFare = (bus?.price || 0) * selectedSeats.length
  const gst = totalFare * 0.18
  const finalTotal = totalFare + gst

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Select Seats" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Bus Info */}
        {bus && (
          <div className="card mb-4 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{bus.operator}</h3>
                <p className="text-sm text-gray-600">{bus.route} • {bus.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">₹{bus.price}</p>
                <p className="text-xs text-gray-500">per seat</p>
              </div>
            </div>
          </div>
        )}

        {/* Seat Layout */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Select Your Seats</h3>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded border-2 border-gray-300"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded border-2 border-primary-700"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded border-2 border-gray-500"></div>
              <span className="text-gray-600">Booked</span>
            </div>
          </div>

          {/* Driver/Steering Wheel Indicator */}
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-200 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-600">🚌 Driver</p>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2">
            {seats.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-500 w-6">{row[0].number[0]}</span>
                <div className="flex space-x-1">
                  {row.map((seat, seatIdx) => (
                    <button
                      key={seatIdx}
                      onClick={() => !seat.booked && toggleSeat(seat.number)}
                      disabled={seat.booked}
                      className={`w-10 h-10 rounded border-2 font-medium text-xs transition-all ${
                        seat.booked
                          ? 'bg-gray-400 border-gray-500 cursor-not-allowed text-white'
                          : seat.selected
                          ? 'bg-primary-600 border-primary-700 text-white'
                          : 'bg-gray-200 border-gray-300 hover:bg-primary-100 hover:border-primary-400'
                      }`}
                    >
                      {seat.number.slice(1)}
                    </button>
                  ))}
                </div>
                {rowIdx === 4 && (
                  <div className="w-16 text-center">
                    <p className="text-xs text-gray-400">Aisle</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Details */}
        <div className="card mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="text-primary-600" size={20} />
            <h3 className="font-semibold text-gray-800">Passenger Details</h3>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={passengerDetails.name}
              onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Age"
                value={passengerDetails.age}
                onChange={(e) => setPassengerDetails({ ...passengerDetails, age: e.target.value })}
                className="input-field"
              />
              <select
                value={passengerDetails.gender}
                onChange={(e) => setPassengerDetails({ ...passengerDetails, gender: e.target.value })}
                className="input-field"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={passengerDetails.phone}
              onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={passengerDetails.email}
              onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Fare Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seats ({selectedSeats.length})</span>
              <span className="text-gray-800">₹{totalFare}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%)</span>
              <span className="text-gray-800">₹{gst.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-800">Total</span>
                <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={() => navigate('/dashboard')}
          disabled={selectedSeats.length === 0}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={20} />
          <span>Proceed to Pay</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <BottomNavigation />
    </div>
  )
}

