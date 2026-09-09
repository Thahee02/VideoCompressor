import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import './index.css'

import UploadZone from './components/UploadZone'
import ProgressBar from './components/ProgressBar'
import StatsCard from './components/StatsCard'

const POLL_INTERVAL_MS = 1000

// Steps: 'upload' | 'processing' | 'done' | 'error'
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

  // ── Cancel current job (called on cancel button, refresh, tab close) ──
  const cancelJob = useCallback(async (jid) => {
    const id = jid ?? currentJobId.current
    if (!id) return
    clearInterval(pollRef.current)
    try {
      await axios.delete(`/api/cancel/${id}/`)
    } catch (_) { /* best-effort */ }
    currentJobId.current = null
  }, [])

  // ── Warn on refresh/tab close while processing ──
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

  // ── Start polling for job status ──
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
          // Job was deleted (e.g. after download or TTL expiry)
          clearInterval(pollRef.current)
          resetToUpload()
        }
      }
    }, POLL_INTERVAL_MS)
  }, [])

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
  }, [cancelJob])

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
      // Server deletes the job from memory after streaming — just reset UI
      currentJobId.current = null
    } catch (err) {
      setError('Download failed. The file may have already been removed from memory.')
    }
  }, [jobId, fileName])

  // ── Compress another ──
  const resetToUpload = () => {
    clearInterval(pollRef.current)
    setStep('upload')
    setJobId(null)
    setJobData(null)
    setFileName('')
    setOriginalSize(0)
    setError('')
  }

  return (
    <div className="app">
      {/* Animated background blobs */}
      <div className="app-bg" />

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-logo">
            <div className="logo-icon">🎬</div>
            <span className="logo-text">VideoPress</span>
          </div>
          <p className="header-subtitle">
            Smart video compression · No quality loss · 100% private
          </p>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, paddingBottom: 60 }}>
        <div className="container">

          {/* ─── UPLOAD STEP ─── */}
          {step === 'upload' && (
            <UploadZone
              onUpload={handleUpload}
              disabled={uploading}
            />
          )}

          {/* ─── PROCESSING STEP ─── */}
          {step === 'processing' && (
            <div className="glass-card">
              <ProgressBar
                progress={jobData?.progress ?? 0}
                status={jobData?.status ?? 'pending'}
                fileName={fileName}
                originalSize={originalSize}
                onCancel={handleCancel}
              />
            </div>
          )}

          {/* ─── DONE STEP ─── */}
          {step === 'done' && jobData && (
            <div className="glass-card">
              <div className="result-section">
                <StatsCard
                  originalSize={jobData.original_size}
                  compressedSize={jobData.compressed_size}
                  fileName={fileName}
                />
                <div className="btn-row">
                  <button
                    id="download-btn"
                    className="btn btn-success"
                    onClick={handleDownload}
                    type="button"
                  >
                    ⬇️ Download Compressed Video
                  </button>
                  <button
                    id="compress-another-btn"
                    className="btn btn-ghost"
                    onClick={resetToUpload}
                    type="button"
                  >
                    🔁 Compress Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── ERROR STEP ─── */}
          {step === 'error' && (
            <div className="glass-card">
              <div className="error-section">
                <div className="error-icon">⚠️</div>
                <h2 className="error-title">Compression Failed</h2>
                <p className="error-message">{error || 'An unexpected error occurred.'}</p>
                <button
                  id="try-again-btn"
                  className="btn btn-primary"
                  onClick={resetToUpload}
                  type="button"
                  style={{ width: 'auto', paddingInline: 32 }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Feature pills */}
          {step === 'upload' && (
            <div className="features-row">
              <div className="feature-pill">
                <span className="feature-pill-icon">🔒</span>
                100% Private
              </div>
              <div className="feature-pill">
                <span className="feature-pill-icon">⚡</span>
                No Upload to Cloud
              </div>
              <div className="feature-pill">
                <span className="feature-pill-icon">🎯</span>
                No Quality Loss
              </div>
              <div className="feature-pill">
                <span className="feature-pill-icon">🆓</span>
                Completely Free
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
