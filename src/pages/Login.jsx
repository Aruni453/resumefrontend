import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authStyles } from '../assets/dummystyle'
import { API_BASE_URL } from '../config'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    authType: 'jwt' // default to jwt
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError('Password is required')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password.trim(),
          authType: formData.authType
        }),
        credentials: formData.authType === 'session' ? 'include' : 'omit'
      })

      const data = await response.json()

      if (response.ok) {
        login(data, formData.authType)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className={authStyles.container}>
        <div className={authStyles.headerWrapper}>
          <h1 className={authStyles.title}>Welcome Back</h1>
          <p className={authStyles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Authentication Type</label>
            <select
              name="authType"
              value={formData.authType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
            >
              <option value="jwt">JWT Token</option>
              <option value="session">Session</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${authStyles.submitButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={authStyles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" className={authStyles.switchButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
