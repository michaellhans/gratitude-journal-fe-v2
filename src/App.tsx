import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Navbar } from './components/Navbar'
import { GratitudeList } from './components/GratitudeList'
import { Dashboard } from './components/Dashboard'
import { LoginPage } from './components/LoginPage'
import { CreateGratitudeEntry } from './components/CreateGratitudeEntry'
import { handleLogout as handleLogoutService } from './services/api'
import { theme } from './theme'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail(undefined)
    handleLogoutService();
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar 
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<CreateGratitudeEntry />} />
            <Route path="/home" element={<GratitudeList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}

export default App
