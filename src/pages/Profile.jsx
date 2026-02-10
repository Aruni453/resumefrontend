import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditForm({ name: parsedUser.name || '', email: parsedUser.email || '' })
    }

    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({ name: user?.name || '', email: user?.email || '' })
  }

  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsEditing(false)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred while updating your profile')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-black mb-2">{user?.name || 'User'}</h1>
                <p className="text-violet-100">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{user?.name || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">{user?.email || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Member Since</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-violet-200 transition-all"
                  >
                    View My Resumes
                  </button>
                  <button
                    onClick={() => navigate('/builder')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-200 transition-all"
                  >
                    Create New Resume
                  </button>
                  <button
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-green-200 transition-all"
                  >
                    AI Resume Assistant
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
