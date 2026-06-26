# Bihar Bus Service

This repository contains a bus service application with separate `backend` and `frontend` projects.

## Project Structure

- `backend/` - Node.js Express API server
  - `server.js` - main backend entry point
  - `routes/` - API route definitions
  - `controllers/` - request handlers
  - `models/` - data models
  - `middleware/` - middleware functions
  - `config/` - database and configuration utilities
  - `utils/` - helper utilities

- `frontend/` - Vite React web application
  - `src/` - React source files
  - `src/components/` - reusable UI components
  - `src/pages/` - page views
  - `src/services/` - API client code
  - `public/` - static assets

## Getting Started

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `env.example` and update settings as needed.
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

## Notes

- Ensure the backend API URL is correctly configured in the frontend service layer.
- Use the provided `env.example` in `backend/` to set up environment variables.
