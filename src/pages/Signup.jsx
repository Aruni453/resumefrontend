import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authStyles } from '../assets/dummystyle'
import { API_BASE_URL } from '../config'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    const trimmedPassword = formData.password.trim();

    if (!trimmedPassword) {
      setError('Password is required')
      setLoading(false)
      return
    }

    if (trimmedPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (trimmedPassword !== formData.confirmPassword.trim()) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: trimmedPassword,
          authType: formData.authType
        }),
        credentials: formData.authType === 'session' ? 'include' : 'omit'
      })

      const data = await response.json()

      if (response.ok) {
        login(data, formData.authType)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className={authStyles.signupContainer}>
        <div className={authStyles.headerWrapper}>
          <h1 className={authStyles.title}>Create Account</h1>
          <p className={authStyles.subtitle}>Join us today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-none"
              placeholder="Confirm your password"
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
            className={`${authStyles.signupSubmit} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={authStyles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={authStyles.switchButton}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
