import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LiveTracking from './pages/LiveTracking'
import BusListing from './pages/BusListing'
import SeatSelection from './pages/SeatSelection'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminControlPanel from './pages/AdminControlPanel'
import BusManagement from './pages/BusManagement'
import RouteManagement from './pages/RouteManagement'
import AddBus from './pages/AddBus'
import AddRoute from './pages/AddRoute'
import UserSettings from './pages/UserSettings'
import MonthlyPass from './pages/MonthlyPass'
import ProtectedRoute from './components/ProtectedRoute'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/buses" element={<BusListing />} />
          <Route path="/seats" element={<SeatSelection />} />
          <Route path="/monthly-pass" element={<MonthlyPass />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminControlPanel /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/buses" element={<ProtectedRoute adminOnly><BusManagement /></ProtectedRoute>} />
          <Route path="/admin/routes" element={<ProtectedRoute adminOnly><RouteManagement /></ProtectedRoute>} />
          <Route path="/admin/add-bus" element={<ProtectedRoute adminOnly><AddBus /></ProtectedRoute>} />
          <Route path="/admin/add-route" element={<ProtectedRoute adminOnly><AddRoute /></ProtectedRoute>} />
        </Routes>
      </Router>
    </NotificationProvider>
  )
}

export default App

