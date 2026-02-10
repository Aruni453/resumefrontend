 import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dashboardStyles, cardStyles } from '../assets/dummystyle'

function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
      console.log('User details:', JSON.parse(userData))
    }

    fetchResumes()
  }, [navigate])

  const fetchResumes = async () => {
    try {
      const authType = localStorage.getItem('authType')
      const token = localStorage.getItem('token')
      const headers = {}

      if (authType === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/resume/', {
        headers,
        credentials: authType === 'session' ? 'include' : 'omit'
      })

      if (response.ok) {
        const data = await response.json()
        setResumes(data)
        console.log('Resume info:', data)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return

    try {
      const authType = localStorage.getItem('authType')
      const token = localStorage.getItem('token')
      const headers = {}

      if (authType === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/resume/${id}`, {
        method: 'DELETE',
        headers,
        credentials: authType === 'session' ? 'include' : 'omit'
      })

      if (response.ok) {
        setResumes(resumes.filter(resume => resume._id !== id))
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('authType')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className={dashboardStyles.spinnerWrapper}>
        <div className={dashboardStyles.spinner}></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <div className={dashboardStyles.headerWrapper}>
        <div>
          <h1 className={dashboardStyles.headerTitle}>My Resumes</h1>
          <p className={dashboardStyles.headerSubtitle}>
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/builder" className={dashboardStyles.createButton}>
            <span className="mr-2">+</span>
            Create New Resume
          </Link>
          <Link to="/profile" className="text-violet-600 hover:text-violet-700 font-bold">
            Profile
          </Link>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-bold">
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {resumes.length === 0 ? (
          <div className={dashboardStyles.emptyStateWrapper}>
            <div className={dashboardStyles.emptyIconWrapper}>
              <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={dashboardStyles.emptyTitle}>No resumes yet</h3>
            <p className={dashboardStyles.emptyText}>
              Create your first resume to get started with building your professional profile.
            </p>
            <Link to="/builder" className={dashboardStyles.createButton}>
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className={dashboardStyles.grid}>
            {/* New Resume Card */}
            <Link to="/builder" className={dashboardStyles.newResumeCard}>
              <svg className={dashboardStyles.newResumeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className={dashboardStyles.newResumeTitle}>Create New Resume</h3>
              <p className={dashboardStyles.newResumeText}>Start building a new resume</p>
            </Link>

            {/* Resume Cards */}
            {resumes.map((resume) => (
              <div key={resume._id} className={cardStyles.resumeCard}>
                <div className={cardStyles.previewArea}>
                  <div className={cardStyles.emptyPreview}>
                    <svg className={cardStyles.emptyPreviewIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className={cardStyles.emptyPreviewText}>Resume Preview</p>
                    <p className={cardStyles.emptyPreviewSubtext}>Click to view</p>
                  </div>
                </div>

                <div className={cardStyles.infoArea}>
                  <h3 className={cardStyles.title}>{resume.title || 'Untitled Resume'}</h3>
                  <div className={cardStyles.dateInfo}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className={cardStyles.actionOverlay}>
                    <div className={cardStyles.actionButtonsContainer}>
                      <Link
                        to={`/builder?id=${resume._id}`}
                        className={cardStyles.editButton}
                      >
                        <svg className={cardStyles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className={cardStyles.deleteButton}
                      >
                        <svg className={cardStyles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
