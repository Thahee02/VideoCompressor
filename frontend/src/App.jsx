import React, { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Contact from './pages/Contact'

const POLL_INTERVAL_MS = 1000

export default function App() {
  const [step, setStep] = useState('upload')
  const [jobId, setJobId] = useState(null)
  const [jobData, setJobData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const pollRef = useRef(null)
  const currentJobId = useRef(null)

  // ── Cancel current job ──
  const cancelJob = useCallback(async (jid) => {
    const id = jid ?? currentJobId.current
    if (!id) return
    clearInterval(pollRef.current)
    try {
      await axios.delete(`/api/cancel/${id}/`)
    } catch (_) { /* best-effort */ }
    currentJobId.current = null
  }, [])

  // ── Reset to upload ──
  const resetToUpload = useCallback(() => {
    clearInterval(pollRef.current)
    setStep('upload')
    setJobId(null)
    setJobData(null)
    setFileName('')
    setOriginalSize(0)
    setError('')
  }, [])

  // ── Warn on refresh/tab close ──
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (currentJobId.current) {
        cancelJob(currentJobId.current)
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [cancelJob])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current)
      cancelJob(currentJobId.current)
    }
  }, [cancelJob])

  // ── Polling ──
  const startPolling = useCallback((jid) => {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`/api/status/${jid}/`)
        const data = res.data
        setJobData(data)

        if (data.status === 'done') {
          clearInterval(pollRef.current)
          setStep('done')
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current)
          setError(data.error ?? 'Compression failed.')
          setStep('error')
        } else if (data.status === 'cancelled') {
          clearInterval(pollRef.current)
          resetToUpload()
        }
      } catch (err) {
        if (err.response?.status === 404) {
          clearInterval(pollRef.current)
          resetToUpload()
        }
      }
    }, POLL_INTERVAL_MS)
  }, [resetToUpload])

  // ── Handle upload ──
  const handleUpload = useCallback(async (file, preset) => {
    setUploading(true)
    setError('')
    setFileName(file.name)
    setOriginalSize(file.size)

    const formData = new FormData()
    formData.append('video', file)
    formData.append('preset', preset)

    try {
      const res = await axios.post('/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { job_id } = res.data
      setJobId(job_id)
      currentJobId.current = job_id
      setStep('processing')
      startPolling(job_id)
    } catch (err) {
      const msg = err.response?.data?.error ?? 'Upload failed. Please try again.'
      setError(msg)
      setStep('error')
    } finally {
      setUploading(false)
    }
  }, [startPolling])

  // ── Handle cancel ──
  const handleCancel = useCallback(async () => {
    await cancelJob(currentJobId.current)
    setJobId(null)
    currentJobId.current = null
    resetToUpload()
  }, [cancelJob, resetToUpload])

  // ── Handle download ──
  const handleDownload = useCallback(async () => {
    if (!jobId) return
    try {
      const res = await axios.get(`/api/download/${jobId}/`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'video/mp4' }))
      const a = document.createElement('a')
      const base = fileName.replace(/\.[^.]+$/, '')
      a.href = url
      a.download = `${base}_compressed.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      currentJobId.current = null
    } catch (err) {
      setError('Download failed. The file may have already been removed from memory.')
    }
  }, [jobId, fileName])

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  step={step}
                  jobData={jobData}
                  fileName={fileName}
                  originalSize={originalSize}
                  error={error}
                  uploading={uploading}
                  handleUpload={handleUpload}
                  handleCancel={handleCancel}
                  handleDownload={handleDownload}
                  resetToUpload={resetToUpload}
                />
              }
            />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}
