import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ResumeBuilder from './pages/ResumeBuilder'
import AIAssistant from './pages/AIAssistant'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/builder' element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path='/ai-assistant' element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />

    </Routes>
  )
}

export default App
