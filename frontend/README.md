# Bihar Bus Service - Frontend

Modern, fully responsive React.js frontend for Bihar Bus Service.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on **http://localhost:5000**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   └── BottomNavigation.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── LiveTracking.jsx
│   │   ├── BusListing.jsx
│   │   ├── SeatSelection.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── BusManagement.jsx
│   │   └── RouteManagement.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Features

- ✅ 10 Complete Screens
- ✅ Fully Responsive Design
- ✅ Modern UI with Tailwind CSS
- ✅ React Router Navigation
- ✅ API Integration Ready
- ✅ Mobile-First Design

## 🔧 Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5001/api
```

## 📱 Available Routes

- `/` - Home Screen
- `/tracking` - Live Bus Tracking
- `/buses` - Bus Listing
- `/seats` - Seat Selection
- `/login` - Login Page
- `/register` - Registration
- `/dashboard` - User Dashboard
- `/admin` - Admin Dashboard
- `/admin/buses` - Bus Management
- `/admin/routes` - Route Management

## 🛠️ Build

```bash
npm run build
```

## 📦 Dependencies

- React 18
- React Router DOM
- Axios
- Lucide React (Icons)
- Tailwind CSS
- Vite

---

**Travel Smart Across Bihar** 🚌

