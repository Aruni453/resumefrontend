import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  containerStyles,
  buttonStyles,
  statusStyles,
  inputStyles,
  photoSelectorStyles,
  titleInputStyles,
  modalStyles
} from '../assets/dummystyle'
import Resume1 from '../assets/Resume1.png'
import Resume2 from '../assets/Resume2.png'
import Resume3 from '../assets/Resume3.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function ResumeBuilder() {
  const [searchParams] = useSearchParams()
  const resumeId = searchParams.get('id')
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('template')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const defaultResumeData = {
    title: 'My Resume',
    template: null,
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    education: [],
    workExperience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: []
  }

  const [resumeData, setResumeData] = useState(defaultResumeData)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  // --- AI Content Generation ---
  const generateAIContent = async (type, additionalData = {}) => {
    setAiLoading(true)
    setAiError(null)

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first!')
      navigate('/login')
      setAiLoading(false)
      return
    }

    try {
      let data = {}
      if (type === 'summary') {
        data = {
          name: resumeData.personalInfo.fullName,
          experience: resumeData.workExperience,
          education: resumeData.education,
          skills: resumeData.skills.map(skill => ({ name: skill.name }))
        }
      } else if (type === 'skills') {
        data = {
          experience: resumeData.workExperience,
          education: resumeData.education
        }
      } else if (type === 'job-description') {
        data = {
          description: additionalData.description
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, data })
      })

      if (response.status === 401) {
        alert('Session expired. Please login again.')
        localStorage.removeItem('token')
        navigate('/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate content')
      }

      const result = await response.json()
      if (type === 'summary') {
        updatePersonalInfo('summary', result.content)
      } else if (type === 'skills') {
        const newSkills = result.content.split(',').map(skill => ({
          name: skill.trim(),
          level: 3
        }))
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills]
        }))
      } else if (type === 'job-description') {
        updateWorkExperience(additionalData.index, 'description', result.content)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      setAiError(error.message || 'Failed to generate content')
    } finally {
      setAiLoading(false)
    }
  }

  // --- Fetch Resume on Mount ---
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (resumeId) fetchResume()
  }, [resumeId, navigate])

  const fetchResume = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) return

      const data = await response.json()
      setResumeData({
        ...defaultResumeData,
        ...data,
        personalInfo: { ...defaultResumeData.personalInfo, ...(data.personalInfo || {}) }
      })
    } catch (error) {
      console.error('Error fetching resume:', error)
    }
  }

  // --- Save Resume ---
  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first!')
      navigate('/login')
      setSaving(false)
      return
    }

    try {
      // Upload photo if exists
      if (photo && resumeId) {
        const formData = new FormData()
        formData.append('thumbnail', photo)
        const uploadResponse = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (!uploadResponse.ok) {
          alert('Error uploading photo')
          setSaving(false)
          return
        }
      }

      const method = resumeId ? 'PUT' : 'POST'
      const url = resumeId ? `${API_BASE_URL}/api/resume/${resumeId}` : `${API_BASE_URL}/api/resume/`
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resumeData)
      })

      if (!response.ok) {
        alert('Error saving resume')
        return
      }

      const data = await response.json()

      // If creating new resume, upload photo now
      if (!resumeId && photo) {
        const formData = new FormData()
        formData.append('thumbnail', photo)
        const uploadResponse = await fetch(`${API_BASE_URL}/api/resume/${data._id}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (!uploadResponse.ok) alert('Resume saved but photo upload failed')
        navigate(`/builder?id=${data._id}`)
      } else if (!resumeId) {
        navigate(`/builder?id=${data._id}`)
      }

      alert('Resume saved successfully!')
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Error saving resume')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    })
  }

  // --- Add / Update / Remove Helpers ---
  const addEducation = () => setResumeData({ ...resumeData, education: [...resumeData.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }] })
  const updateEducation = (index, field, value) => { const updated = [...resumeData.education]; updated[index][field] = value; setResumeData({ ...resumeData, education: updated }) }
  const removeEducation = (index) => setResumeData({ ...resumeData, education: resumeData.education.filter((_, i) => i !== index) })

  const addWorkExperience = () => setResumeData({ ...resumeData, workExperience: [...resumeData.workExperience, { company: '', position: '', startDate: '', endDate: '', current: false, description: '', achievements: [''] }] })
  const updateWorkExperience = (index, field, value) => { const updated = [...resumeData.workExperience]; updated[index][field] = value; setResumeData({ ...resumeData, workExperience: updated }) }
  const removeWorkExperience = (index) => setResumeData({ ...resumeData, workExperience: resumeData.workExperience.filter((_, i) => i !== index) })

  const addSkill = () => setResumeData({ ...resumeData, skills: [...resumeData.skills, { name: '', level: 3 }] })
  const updateSkill = (index, field, value) => { const updated = [...resumeData.skills]; updated[index][field] = value; setResumeData({ ...resumeData, skills: updated }) }
  const removeSkill = (index) => setResumeData({ ...resumeData, skills: resumeData.skills.filter((_, i) => i !== index) })

  const addProject = () => setResumeData({ ...resumeData, projects: [...resumeData.projects, { title: '', description: '', github: '', liveDemo: '' }] })
  const updateProject = (index, field, value) => { const updated = [...resumeData.projects]; updated[index][field] = value; setResumeData({ ...resumeData, projects: updated }) }
  const removeProject = (index) => setResumeData({ ...resumeData, projects: resumeData.projects.filter((_, i) => i !== index) })

  const addCertification = () => setResumeData({ ...resumeData, certifications: [...resumeData.certifications, { title: '', issuer: '', year: '' }] })
  const updateCertification = (index, field, value) => { const updated = [...resumeData.certifications]; updated[index][field] = value; setResumeData({ ...resumeData, certifications: updated }) }
  const removeCertification = (index) => setResumeData({ ...resumeData, certifications: resumeData.certifications.filter((_, i) => i !== index) })

  // --- Download PDF ---
  const handleDownloadPDF = async () => {
    if (!resumeId) return alert('Please save your resume first')
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/download`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) return alert('Error downloading PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resumeData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF')
    }
  }

  // --- Sections & UI remain the same ---
  const sections = [
    { id: 'template', label: 'Choose Template', icon: '📄' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className={containerStyles.main}>
        {/* Header */}
        <div className={containerStyles.header}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={buttonStyles.back}
            >
              ← Back to Dashboard
            </button>
            <div className={titleInputStyles.container}>
              <h1 className={titleInputStyles.titleText}>{resumeData.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className={buttonStyles.save}
            >
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
            {resumeId && (
              <button
                onClick={handleDownloadPDF}
                className={buttonStyles.download}
              >
                Download PDF
              </button>
            )}
          </div>
        </div>

        <div className={containerStyles.grid}>
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-violet-100 text-violet-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className={containerStyles.formContainer}>
            {activeSection === 'template' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Choose Your Template</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[Resume1, Resume2, Resume3].map((template, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedTemplate(index + 1);
                        setResumeData(prev => ({ ...prev, template: index + 1 }));
                      }}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all ${
                        selectedTemplate === index + 1
                          ? 'border-violet-500 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={template}
                        alt={`Template ${index + 1}`}
                        className="w-full h-auto"
                      />
                      {selectedTemplate === index + 1 && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setActiveSection('personal')}
                      className={buttonStyles.next}
                    >
                      Continue with Template {selectedTemplate}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'personal' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Personal Information</h2>
                <div className="space-y-6">
                  <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className={inputStyles.inputField}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className={inputStyles.inputField}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Phone</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className={inputStyles.inputField}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Address</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.address}
                      onChange={(e) => updatePersonalInfo('address', e.target.value)}
                      className={inputStyles.inputField}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Professional Summary</label>
                    <textarea
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none resize-none"
                      rows={4}
                      placeholder="Write a brief professional summary..."
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => generateAIContent('summary')}
                      disabled={aiLoading}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
                    >
                      {aiLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Education</h2>
                <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) => updateEducation(index, 'field', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="GPA"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <DatePicker
                          selected={edu.startDate ? new Date(edu.startDate) : null}
                          onChange={(date) => updateEducation(index, 'startDate', date)}
                          placeholderText="Start Date"
                          className="p-3 border border-gray-300 rounded-xl w-full"
                        />
                        <DatePicker
                          selected={edu.endDate ? new Date(edu.endDate) : null}
                          onChange={(date) => updateEducation(index, 'endDate', date)}
                          placeholderText="End Date"
                          className="p-3 border border-gray-300 rounded-xl w-full"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={edu.description}
                        onChange={(e) => updateEducation(index, 'description', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mt-4"
                        rows={3}
                      />
                      <button
                        onClick={() => removeEducation(index)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl"
                  >
                    Add Education
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Work Experience</h2>
                <div className="space-y-6">
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <DatePicker
                          selected={exp.startDate ? new Date(exp.startDate) : null}
                          onChange={(date) => updateWorkExperience(index, 'startDate', date)}
                          placeholderText="Start Date"
                          className="p-3 border border-gray-300 rounded-xl w-full"
                        />
                        <DatePicker
                          selected={exp.endDate ? new Date(exp.endDate) : null}
                          onChange={(date) => updateWorkExperience(index, 'endDate', date)}
                          placeholderText="End Date"
                          className="p-3 border border-gray-300 rounded-xl w-full"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                            className="mr-2"
                          />
                          Currently working here
                        </label>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mt-4"
                        rows={4}
                      />
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => generateAIContent('job-description', { index })}
                          disabled={aiLoading}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl"
                        >
                          Generate with AI
                        </button>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addWorkExperience}
                    className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Skills</h2>
                <div className="space-y-4">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <input
                        type="text"
                        placeholder="Skill name"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-xl"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                        className="p-3 border border-gray-300 rounded-xl"
                      >
                        <option value={1}>Beginner</option>
                        <option value={2}>Intermediate</option>
                        <option value={3}>Advanced</option>
                        <option value={4}>Expert</option>
                        <option value={5}>Master</option>
                      </select>
                      <button
                        onClick={() => removeSkill(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={addSkill}
                      className="flex-1 py-3 bg-violet-500 text-white font-bold rounded-xl"
                    >
                      Add Skill
                    </button>
                    <button
                      onClick={() => generateAIContent('skills')}
                      disabled={aiLoading}
                      className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl"
                    >
                      {aiLoading ? 'Generating...' : 'Generate with AI'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Projects</h2>
                <div className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mb-4"
                      />
                      <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mb-4"
                        rows={4}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="url"
                          placeholder="GitHub Link"
                          value={project.github}
                          onChange={(e) => updateProject(index, 'github', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="url"
                          placeholder="Live Demo"
                          value={project.liveDemo}
                          onChange={(e) => updateProject(index, 'liveDemo', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Certifications</h2>
                <div className="space-y-6">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Certification Title"
                          value={cert.title}
                          onChange={(e) => updateCertification(index, 'title', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Issuing Organization"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={cert.year}
                          onChange={(e) => updateCertification(index, 'year', e.target.value)}
                          className="p-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                      <button
                        onClick={() => removeCertification(index)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCertification}
                    className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl"
                  >
                    Add Certification
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
